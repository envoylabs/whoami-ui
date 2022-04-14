import { useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { useToken } from 'hooks/token'
import { useRouter } from 'next/dist/client/router'
import { TokenCard } from 'components/NameCard'
import { Error } from 'components/Error'
import Loader from 'components/Loader'
import { Metadata } from 'util/types/messages'
import { useForm, RegisterOptions } from 'react-hook-form'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import InputField from 'components/InputField'
import * as R from 'ramda'
import { transferFields } from 'util/forms'

type FormValues = {
  recipient: string
}

const TransferToken: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string
  const enabled = process.env.NEXT_PUBLIC_TRANSFERS_ENABLED
  const transfersEnabled = enabled === 'true'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()
  const { signingClient, walletAddress } = useSigningClient()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const { token } = useToken(tokenName)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  if (!tokenName) {
    return null
  }

  const onSubmit = async (data: FormValues) => {
    if (!signingClient || !walletAddress) {
      return
    }

    try {
      const msg = {
        transfer_nft: {
          token_id: tokenName,
          recipient: data.recipient,
        },
      }
      // validate it is an address
      await signingClient.getAccount(data.recipient)
      setLoading(true)
      const response = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (response) {
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
    transferFields
  )

  return (
    <>
      {transfersEnabled ? (
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
              <div className="flex flex-wrap justify-center pt-4">
                {token ? (
                  <div className="mr-3">
                    <div className="sticky top-5 mt-5">
                      <TokenCard name={tokenName} token={token as Metadata} />
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-center m-5">
                  <h2 className="text-4xl font-bold">
                    <SwitchHorizontalIcon className="h-9 w-9 inline mr-2 mb-1" />
                    Transfer {tokenName}
                  </h2>
                  <p className="w-96">Transfer the token to another address.</p>
                  <div className="p-1">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="px-4 pb-4"
                    >
                      <>{inputs}</>

                      <div className="py-4">
                        <input
                          type="submit"
                          className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl w-full"
                          value="Transfer Token"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </WalletLoader>
      ) : (
        <div className="py-4">
          <Notice message={`Transfers are not currently available`} />
        </div>
      )}
    </>
  )
}

export default TransferToken
