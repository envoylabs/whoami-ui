import { useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { NameCard } from 'components/NameCard'
import { Error } from 'components/Error'
import { CopyInput } from 'components/CopyInput'
import { useSigningClient } from 'contexts/cosmwasm'
import { useToken } from 'hooks/token'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Metadata } from 'util/types/messages'
import { useTokenList } from 'hooks/tokens'
import { useStore } from 'store/base'
import * as R from 'ramda'

const TokenView: NextPage = () => {
  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)
  const { tokens } = useTokenList()
  const { alias, loadingAlias } = usePrimaryAlias()
  const [error, setError] = useState()

  const { register, handleSubmit } = useForm()

  const getHost = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.host
      return host
    } else {
      return process.env.NEXT_PUBLIC_SITE_HOST as string
    }
  }

  const onSubmit = async () => {
    if (!signingClient || !walletAddress) {
      return
    }

    const msg = {
      update_primary_alias: {
        token_id: tokenName,
      },
    }

    try {
      let updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (updatedToken) {
        router.push(`/tokens/manage`)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
      setError(e.message)
    }
  }

  if (!tokenName) {
    return null
  }

  return (
    <WalletLoader>
      {token ? (
        <>
          {error && (
            <div className="py-4">
              <Error
                errorTitle={'Something went wrong!'}
                errorMessage={error!}
              />
            </div>
          )}
          <NameCard name={tokenName} token={token as Metadata} />
          <div className="flex flex-wrap justify-center w-full">
            <div className="py-4">
              <CopyInput
                inputText={`https://${getHost()}/dens::${tokenName}`}
                label={'Copy'}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center">
            <div className="p-1">
              <Link href={`/tokens/manage`} passHref>
                <a className="btn btn-outline mt-6">
                  <p className="font-bold flex">{`< Back`}</p>
                </a>
              </Link>
            </div>

            {(alias as string) !== tokenName &&
            '' !== tokenName &&
            signingClient &&
            R.includes(tokenName, tokens) ? (
              <div className="p-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="submit"
                    className="btn btn-outline mt-6"
                    value="Set as primary"
                  />
                </form>
              </div>
            ) : null}

            {tokenName && tokens && R.includes(tokenName, tokens) ? (
              <>
                <div className="p-1">
                  <Link href={`/tokens/${tokenName}/update`} passHref>
                    <a className="btn btn-outline mt-6">
                      <p className="font-bold flex">{`Update metadata`}</p>
                    </a>
                  </Link>
                </div>

                <div className="p-1">
                  <Link href={`/tokens/${tokenName}/burn`} passHref>
                    <a className="btn btn-outline mt-6">
                      <p className="font-bold flex">{`Burn`}</p>
                    </a>
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <h1 className="text-4xl font-bold">Not found</h1>
      )}
    </WalletLoader>
  )
}

export default TokenView
