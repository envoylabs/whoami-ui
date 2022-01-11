import type { NextPage } from 'next'
import InputField from 'components/InputField'
import { useForm, RegisterOptions, FieldError } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import WalletLoader from 'components/WalletLoader'
import { TokenCard } from 'components/NameCard'
import { Error } from 'components/Error'
import { Notice } from 'components/Notice'
import { useSigningClient } from 'contexts/cosmwasm'
import { defaultMintFee, getMintCost } from 'util/fee'
import {
  convertMicroDenomToDenom,
  convertDenomToHumanReadableDenom,
} from 'util/conversion'
import { defaultMemo } from 'util/memo'
import { mintFields, getMintFormErrors } from 'util/forms'
import Loader from 'components/Loader'
import * as R from 'ramda'

type FormValues = {
  image: OptionString
  image_data: OptionString
  email: OptionString
  external_url: OptionString
  public_name: OptionString
  public_bio: OptionString
  twitter_id: OptionString
  discord_id: OptionString
  telegram_id: OptionString
  keybase_id: OptionString
  validator_operator_address: OptionString
}

const defaults = {
  image: null,
  image_data: null,
  email: null,
  external_url: null,
  public_name: null,
  public_bio: null,
  twitter_id: null,
  discord_id: null,
  telegram_id: null,
  keybase_id: null,
  validator_operator_address: null,
}

const Mint: NextPage = () => {
  const router = useRouter()
  const { signingClient, walletAddress } = useSigningClient()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const denom = process.env.NEXT_PUBLIC_STAKING_DENOM as string
  const [token, setToken] = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaults,
  })

  if (!router.isReady) {
    return null
  }
  const token_id = router.query.name as string

  // this returns an array of denoms.
  // in practice we usually want the first for display
  // and the array for sending to the contract
  const mintCost = getMintCost(token_id)
  const humanMintCost = convertMicroDenomToDenom(mintCost[0].amount)
  const humanDenom = R.toUpper(convertDenomToHumanReadableDenom(denom))

  const onSubmit = async (data: FormValues) => {
    if (!signingClient) {
      return
    }

    setLoading(true)

    const {
      image,
      image_data,
      email,
      external_url,
      public_name,
      public_bio,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    } = data

    // this should already be done,
    // but paranoia, ok?
    const normalizedTokenId = R.toLower(token_id)

    const msg = {
      mint: {
        owner: walletAddress,
        token_id: normalizedTokenId,
        token_uri: null, // TODO - support later
        extension: {
          image,
          image_data, // TODO - support later
          email,
          external_url,
          public_name,
          public_bio,
          twitter_id,
          discord_id,
          telegram_id,
          keybase_id,
          validator_operator_address,
        },
      },
    }

    try {
      // const mintCost = getMintCost(token_id)

      let mintedToken = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo,
        mintCost
      )
      if (mintedToken) {
        router.push(`/tokens/${token_id}`)
        setLoading(false)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
      setError(e.message)
      setLoading(false)
    }
  }

  const inputs = R.map(
    (i) => (
      <InputField<FormValues>
        key={i.fieldId as string}
        fieldName={i.fieldId as string}
        label={i.fieldName as string}
        register={register}
        validationParams={i.validationParams as RegisterOptions}
        onChange={(e) => {
          setToken((curr) => ({
            ...curr,
            [i.fieldId as string]: e.target.value,
          }))
        }}
      />
    ),
    mintFields
  )

  return (
    <WalletLoader>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Notice
            message={`The mint cost for this token is ${humanMintCost} ${humanDenom}`}
          />

          {error && (
            <div className="py-4">
              <Error
                errorTitle={'Something went wrong!'}
                errorMessage={error}
              />
            </div>
          )}
          {!R.isEmpty(errors) && (
            <div className="py-4">
              <Error
                errorTitle={'Form error'}
                errorMessage={`Please check these fields: ${R.join(
                  ', ',
                  getMintFormErrors(errors)
                )}`}
              />
            </div>
          )}
          <div className="flex flex-wrap">
            <div className="mr-3">
              <div className="sticky top-5 mt-5">
                <TokenCard
                  name={router.query.name as string}
                  token={token as Metadata}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <>{inputs}</>

              <input
                type="submit"
                className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl"
                value="Create Username"
              />
            </form>
          </div>
        </>
      )}
    </WalletLoader>
  )
}

export default Mint
