import type { NextPage } from 'next'
import InputField from 'components/InputField'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import WalletLoader from 'components/WalletLoader'
import { TokenCard } from 'components/NameCard'
import { useSigningClient } from 'contexts/cosmwasm'
import { defaultMintFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
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
  const [token, setToken] = useState(defaults)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: defaults,
  })

  if (!router.isReady) {
    return null
  }
  const token_id = router.query.name as string

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
        defaultMintFee,
        defaultMemo
      )
      if (mintedToken) {
        setLoading(false)
        router.push(`/tokens/${token_id}`)
      }
    } catch (e) {
      // TODO env var for dev logging
      //console.log(e)
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
          setToken(curr => ({ ...curr, [i[0] as string]: e.target.value }))
        }}
      />
    ),
    fields
  )

  return (
    <WalletLoader>
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
    </WalletLoader>
  )
}

export default Mint
