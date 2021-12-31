import type { NextPage } from 'next'
import InputField from 'components/InputField'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import WalletLoader from 'components/WalletLoader'
import { TokenCard } from 'components/NameCard'
import { Error } from 'components/Error'
import { useSigningClient } from 'contexts/cosmwasm'
import { defaultMintFee, getMintCost } from 'util/fee'
import {
  convertMicroDenomToDenom,
  convertDenomToHumanReadableDenom,
} from 'util/conversion'
import { defaultMemo } from 'util/memo'
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
  const denom = process.env.NEXT_PUBLIC_STAKING_DENOM
  const [token, setToken] = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const { register, handleSubmit } = useForm<FormValues>({
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

  const fields = [
    ['public_name', 'Name', true],
    ['public_bio', 'Bio', true],
    ['image', 'Image URL', true],
    ['email', 'Email', true],
    ['external_url', 'Website', true],
    ['twitter_id', 'Twitter', true],
    ['discord_id', 'Discord', true],
    ['telegram_id', 'Telegram username', true],
    ['keybase_id', 'Keybase.io', true],
    ['validator_operator_address', 'Validator operator address', true],
  ]

  const inputs = R.map(
    (i) => (
      <InputField<FormValues>
        key={i[0] as string}
        fieldName={i[0] as string}
        label={i[1] as string}
        register={register}
        optional={i[2] as boolean}
        onChange={(e) => {
          setToken((curr) => ({ ...curr, [i[0] as string]: e.target.value }))
        }}
      />
    ),
    fields
  )

  return (
    <WalletLoader>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <svg
              class="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p>
              The mint cost for this token is {humanMintCost}
              {humanDenom}
            </p>
          </div>
          {error && (
            <div class="py-4">
              <Error
                errorTitle={'Something went wrong!'}
                errorMessage={error}
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
