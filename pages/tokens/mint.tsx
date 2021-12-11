import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import WalletLoader from 'components/WalletLoader'
import InputField from 'components/InputField'
import { useSigningClient } from 'contexts/cosmwasm'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import * as msgs from 'util/messages'
import * as mt from 'util/types/messages'
import { OptionString } from 'util/types/base'
import * as R from 'ramda'

type FormValues = {
  token_id: string // the username
  // these are all the extension fields.
  // if they are empty, they should be nulled
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

const Mint: NextPage = () => {
  const router = useRouter()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const { signingClient, walletAddress } = useSigningClient()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
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
    },
  })

  const onSubmit = async (data: FormValues) => {
    if (!signingClient) {
      return
    }

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

    const msg = {
      mint: {
        owner: walletAddress,
        token_id: token_id,
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
      let mintedToken = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (mintedToken) {
        router.push(`/tokens/${token_id}/view`)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
    }
  }

  const fields = [
    ['token_id', 'Username', false],
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
      />
    ),
    fields
  )

  return (
    <WalletLoader>
      <h1 className="text-3xl font-bold">Create your username</h1>

      <div className="p-6">
        <p className="max-w-prose">
          Only a username is required. Everything else is optional. If you are a
          validator, consider filling in as much as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <>{inputs}</>

        <input
          type="submit"
          className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl"
          value="Create Username"
        />
      </form>
    </WalletLoader>
  )
}

export default Mint
