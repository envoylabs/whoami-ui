import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import WalletLoader from 'components/WalletLoader'
import InputField from 'components/InputField'
import { useSigningClient } from 'contexts/cosmwasm'
import { useToken } from 'hooks/token'
import { defaultExecuteFee } from 'util/fee'
import * as msgs from 'util/messages'
import * as mt from 'util/types/messages'
import { OptionString } from 'util/types/base'
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

const TokenUpdate: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const { signingClient, walletAddress } = useSigningClient()
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      image: token?.image || null,
      image_data: token?.image_data || null,
      email: token?.email || null,
      external_url: token?.external_url || null,
      public_name: token?.public_name || null,
      public_bio: token?.public_bio || null,
      twitter_id: token?.twitter_id || null,
      discord_id: token?.discord_id || null,
      telegram_id: token?.telegram_id || null,
      keybase_id: token?.keybase_id || null,
      validator_operator_address: token?.validator_operator_address || null,
    },
  })

  const onSubmit = async (data: FormValues) => {
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

    const defaultMemo = ''

    console.log(contractAddress)
    console.log(msg)
    try {
      let updatedToken = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (updatedToken) {
        router.push(`/tokens/${tokenName}/view`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const fields = [
    ['public_name', 'Name (optional)'],
    ['public_bio', 'Bio (optional)'],
    ['email', 'Email (optional)'],
    ['external_url', 'Website (optional)'],
    ['twitter_id', 'Twitter (optional)'],
    ['discord_id', 'Discord (optional)'],
    ['telegram_id', 'Telegram username (optional)'],
    ['keybase_id', 'Keybase.io (optional)'],
    ['validator_operator_address', 'Validator operator address (optional)'],
  ]

  const inputs = R.map(
    (i) => (
      <InputField<FormValues>
        key={i[0]}
        fieldName={i[0]}
        label={i[1]}
        register={register}
      />
    ),
    fields
  )

  return (
    <WalletLoader>
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
    </WalletLoader>
  )
}

export default TokenUpdate
