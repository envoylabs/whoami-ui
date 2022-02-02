import type { NextPage } from 'next'
import InputField from 'components/InputField'
import { useForm, RegisterOptions, FieldError } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useStore } from 'store/base'
import { OptionString } from 'util/types/base'
import { MetadataWithTokenId } from 'util/types/messages'
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
  token_id: string
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
  token_id: '',
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

const MintPath: NextPage = () => {
  const router = useRouter()
  const { signingClient, walletAddress } = useSigningClient()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const denom = process.env.NEXT_PUBLIC_STAKING_DENOM as string
  const [token, setToken] = useState(defaults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const appendTokenId = useStore((state) => state.appendTokenId)

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
  const parent_token_id = router.query.name as string

  const normalize = (inputString: string) => {
    const invalidChrsRemoved = R.replace(/[^a-z0-9\-\_]/g, '', inputString)
    return R.replace(/[_\-]{2,}/g, '', invalidChrsRemoved)
  }

  const onSubmit = async (data: FormValues) => {
    if (!signingClient || !walletAddress) {
      return
    }

    setLoading(true)

    const {
      token_id,
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
    const normalizedTokenId = normalize(R.toLower(token_id))

    const msg = {
      mint_path: {
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
          parent_token_id,
        },
      },
    }

    try {
      let mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      )
      if (mintedToken) {
        router.push({
          pathname: `/tokens/${parent_token_id}::${token_id}`,
        })
        appendTokenId(token_id)
        // setLoading(false)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
      setError(e.message)
      setLoading(false)
    }
  }

  // prepend the token_id field
  const pathMintFields = R.prepend(
    {
      fieldId: 'token_id',
      fieldName: 'Path ID (must be unique)',
      validationParams: {
        required: true,
        maxLength: 50,
        pattern: /[a-z0-9\-\_]/,
      },
    },
    mintFields
  )

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
    pathMintFields
  )

  return (
    <WalletLoader>
      {loading ? (
        <div className="flex w-full justify-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {error && (
            <div className="flex w-full justify-center">
              <div className="py-4 w-96">
                <Error
                  errorTitle={'Something went wrong!'}
                  errorMessage={error!}
                />
              </div>
            </div>
          )}
          {!R.isEmpty(errors) && (
            <div className="flex w-full justify-center">
              <div className="py-4 w-96">
                <Error
                  errorTitle={'Form error'}
                  errorMessage={`Please check these fields: ${R.join(
                    ', ',
                    getMintFormErrors(errors)
                  )}`}
                />
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center pt-6">
            <div className="mr-3">
              <div className="sticky top-5 mt-5">
                <TokenCard
                  name={
                    R.isEmpty(token.token_id)
                      ? parent_token_id
                      : `${parent_token_id}::${token.token_id}`
                  }
                  token={token as MetadataWithTokenId}
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex w-full justify-center">
                <h4 className="text-2xl py-4">Profile data</h4>
              </div>
              <div className="flex w-full justify-center">
                <p>
                  Tip: to generate a PFP URL, <br /> use a service like{' '}
                  <a
                    href="https://www.pinata.cloud/"
                    className="pl-1 link link-primary link-hover"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pinata
                  </a>
                  .
                </p>
              </div>
              <div className="flex w-full justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4">
                  <>{inputs}</>

                  <div className="py-4">
                    <input
                      type="submit"
                      className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl"
                      value="Create Path"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </WalletLoader>
  )
}

export default MintPath
