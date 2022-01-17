import { useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { FireIcon } from '@heroicons/react/solid'
import { useToken } from 'hooks/token'
import { useRouter } from 'next/dist/client/router'
import { TokenCard } from 'components/NameCard'
import { Error } from 'components/Error'
import Loader from 'components/Loader'
import { Metadata } from 'util/types/messages'
import { useForm } from 'react-hook-form'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'

const BurnToken: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string
  const { handleSubmit } = useForm()
  const { signingClient, walletAddress } = useSigningClient()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const { token } = useToken(tokenName, walletAddress)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  if (!tokenName) {
    return null
  }

  const onSubmit = async () => {
    if (!signingClient) {
      return
    }

    setLoading(true)

    const msg = {
      burn: {
        token_id: tokenName,
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
        router.push(`/tokens/manage`)
        setLoading(false)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
      setError(e.message)
      setLoading(false)
    }
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
                errorMessage={error!}
              />
            </div>
          )}
          <div className="flex flex-wrap">
            {token ? (
              <TokenCard name={tokenName} token={token as Metadata} />
            ) : null}

            <div className="items-center text-left m-5">
              <h2 className="text-4xl font-bold">
                <FireIcon className="h-9 w-9 inline mr-2 mb-1" />
                Burn {tokenName}
              </h2>
              <p className="w-96">
                This will permanently destroy the token. The token will no
                longer be visible from the name service and another token with
                the same name will be mintable.
              </p>
              <div className="p-1">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="submit"
                    className="btn btn-outline mt-6"
                    value="I understand, burn it"
                  />
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </WalletLoader>
  )
}

export default BurnToken
