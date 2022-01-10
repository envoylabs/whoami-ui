import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  useForm,
  UseFormRegister,
  RegisterOptions,
  FieldError,
  FieldErrors,
} from 'react-hook-form'
import WalletLoader from 'components/WalletLoader'
import InputField from 'components/InputField'
import { useSigningClient } from 'contexts/cosmwasm'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import * as msgs from 'util/messages'
import * as mt from 'util/types/messages'
import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import Loader from 'components/Loader'
import { Error } from 'components/Error'
import * as R from 'ramda'

// similar to the create form
// these are the update values
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

interface Field {
  fieldId: string
  fieldName: string
  validationParams: RegisterOptions
}
type Fields = Field[]

const TokenUpdate: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string

  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [token, setToken] = useState<Metadata>()

  const { signingClient, walletAddress } = useSigningClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  useEffect(() => {
    if (!tokenName || !signingClient) {
      return
    }

    const getToken = async () => {
      setLoading(true)
      try {
        let tokenInfo = await signingClient.queryContractSmart(
          contractAddress,
          {
            nft_info: {
              token_id: tokenName,
            },
          }
        )
        setToken(tokenInfo.extension)
        reset({
          image: tokenInfo.extension.image,
          image_data: tokenInfo.extension.image_data,
          email: tokenInfo.extension.email,
          external_url: tokenInfo.extension.external_url,
          public_name: tokenInfo.extension.public_name,
          public_bio: tokenInfo.extension.public_bio,
          twitter_id: tokenInfo.extension.twitter_id,
          discord_id: tokenInfo.extension.discord_id,
          telegram_id: tokenInfo.extension.telegram_id,
          keybase_id: tokenInfo.extension.keybase_id,
          validator_operator_address:
            tokenInfo.extension.validator_operator_address,
        })
        setLoading(false)
      } catch (e) {
        // console.log(e)
        setLoading(false)
      }
    }

    getToken()
  }, [tokenName, contractAddress, signingClient, reset])

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

    const msg = {
      update_metadata: {
        token_id: tokenName,
        metadata: {
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
      let updatedToken = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (updatedToken) {
        router.push(`/tokens/${tokenName}`)
        setLoading(false)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
      setError(e.message)
      setLoading(false)
    }
  }

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const fields: Fields = [
    {
      fieldId: 'public_name',
      fieldName: 'Name',
      validationParams: { required: false, maxLength: 20 },
    },
    {
      fieldId: 'public_bio',
      fieldName: 'Bio',
      validationParams: { required: false, maxLength: 320 },
    },
    {
      fieldId: 'image',
      fieldName: 'Image URL',
      validationParams: { required: false, maxLength: 2048 },
    },
    {
      fieldId: 'email',
      fieldName: 'Email',
      validationParams: {
        required: false,
        pattern: emailRegex,
        maxLength: 320,
      },
    },
    {
      fieldId: 'external_url',
      fieldName: 'Website',
      validationParams: { required: false, maxLength: 2048 },
    },
    {
      fieldId: 'twitter_id',
      fieldName: 'Twitter',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'discord_id',
      fieldName: 'Discord',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'telegram_id',
      fieldName: 'Telegram username',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'keybase_id',
      fieldName: 'Keybase.io',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'validator_operator_address',
      fieldName: 'Validator operator address',
      validationParams: { required: false },
    },
  ]

  const inputs = R.map(
    (i) => (
      <InputField<FormValues>
        key={i.fieldId as string}
        fieldName={i.fieldId as string}
        label={i.fieldName as string}
        register={register}
        validationParams={i.validationParams as RegisterOptions}
        onChange={() => {}}
      />
    ),
    fields
  )

  const errKeyToHuman = (key: string): string => {
    const keysArr = R.map((f) => f.fieldId, fields)
    const index = R.findIndex(
      (i: string) => R.equals(key, i),
      keysArr as string[]
    )
    return R.equals(index, -1) ? '' : fields[index].fieldName
  }

  const formatErrors = (errors: FieldErrors): string => {
    const errorsArray: string[] = R.map((err): string => err.type, errors)
    console.log(errorsArray)
    return R.join(', ', R.map(errKeyToHuman, errorsArray))
  }

  return (
    <WalletLoader>
      {loading ? (
        <Loader />
      ) : (
        <>
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
                errorMessage={`Please check these fields: ${formatErrors(
                  errors
                )}`}
              />
            </div>
          )}
          <h1 className="text-3xl font-bold">Update your profile</h1>

          <div className="p-6">
            <p>Update the data associated with your username.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <>{inputs}</>

            <input
              type="submit"
              className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl w-full"
              value="Update profile"
            />
          </form>
        </>
      )}
    </WalletLoader>
  )
}

export default TokenUpdate
