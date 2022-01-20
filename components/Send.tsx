import { useState, useEffect, MouseEvent } from 'react'
import type { NextPage } from 'next'
import { StdFee, Coin } from '@cosmjs/amino'

import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import {
  convertMicroDenomToDenom,
  convertFromMicroDenom,
  convertDenomToMicroDenom,
} from 'util/conversion'
import { Error } from 'components/Error'
import { Notice } from 'components/Notice'
import { defaultExecuteFee } from 'util/fee'
import Loader from 'components/Loader'
import { defaultMemo } from 'util/memo'

const PUBLIC_CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME
const PUBLIC_STAKING_DENOM = process.env.NEXT_PUBLIC_STAKING_DENOM || 'ujuno'

export function Send({ address, name }: { address: string; name: string }) {
  const { walletAddress, signingClient } = useSigningClient()
  const [balance, setBalance] = useState('')
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState(address)
  const [sendAmount, setSendAmount] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState(defaultMemo)

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return
    }
    setError('')
    setSuccess('')

    signingClient
      .getBalance(walletAddress, PUBLIC_STAKING_DENOM)
      .then((response: any) => {
        const { amount, denom }: { amount: number; denom: string } = response
        setBalance(
          `${convertMicroDenomToDenom(amount)} ${convertFromMicroDenom(denom)}`
        )
      })
      .catch((error) => {
        setError(`Error! ${error.message}`)
        console.log('Error signingClient.getBalance(): ', error)
      })
  }, [signingClient, walletAddress, loadedAt])

  const handleSend = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const amount: Coin[] = [
      {
        amount: convertDenomToMicroDenom(sendAmount),
        denom: PUBLIC_STAKING_DENOM,
      },
    ]

    signingClient
      ?.sendTokens(
        walletAddress,
        recipientAddress,
        amount,
        defaultExecuteFee,
        message
      )
      .then((resp) => {
        console.log('resp', resp)

        const message = `Success! Sent ${sendAmount}  ${convertFromMicroDenom(
          PUBLIC_STAKING_DENOM
        )} and message to ${name}.`

        setLoadedAt(new Date())
        setLoading(false)
        setSendAmount('')
        setSuccess(message)
      })
      .catch((error) => {
        setLoading(false)
        setError(`Error! ${error.message}`)
        console.log('Error signingClient.sendTokens(): ', error)
      })
  }
  return (
    <>
      {loading ? (
        <div className="flex w-full justify-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          <p className="text-2xl p-4">Your wallet has {balance}</p>
          <div className="flex w-full max-w-xl">
            <input
              type="text"
              id="recipient-address"
              className="input input-bordered focus:input-primary input-lg flex-grow font-mono text-center text-lg"
              placeholder={`${address}`}
              onChange={(event) => setRecipientAddress(event.target.value)}
              value={recipientAddress}
            />
          </div>
          <div className="flex w-full max-w-xl  mt-4">
            <input
              type="text"
              id="message"
              className="input input-bordered focus:input-primary input-lg flex-grow font-mono text-center text-lg"
              placeholder={`${message}`}
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
          </div>
          <div className="flex flex-col md:flex-row mt-4 text-2xl w-full max-w-xl justify-between">
            <div className="relative shadow-sm md:mr-2">
              <input
                type="number"
                id="send-amount"
                className="input input-bordered focus:input-primary input-lg w-full pr-24 text-center font-mono text-lg"
                step="0.1"
                placeholder="0.001"
                onChange={(event) => setSendAmount(event.target.value)}
                value={sendAmount}
              />
              <span className="absolute top-0 right-0 bottom-0 px-4 py-5 bg-secondary text-base-100 text-sm rounded">
                {convertFromMicroDenom(PUBLIC_STAKING_DENOM)}
              </span>
            </div>
            <button
              className="mt-4 md:mt-0 btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl flex-grow"
              onClick={handleSend}
            >
              SEND
            </button>
          </div>
          <div className="mt-4 flex flex-col w-full max-w-xl">
            {success.length > 0 && (
              <div className="flex w-full justify-center">
                <div className="py-4 w-96">
                  <Notice message={success!} />
                </div>
              </div>
            )}
            {error.length > 0 && (
              <div className="flex w-full justify-center">
                <div className="py-4 w-96">
                  <Error
                    errorTitle={'Something went wrong!'}
                    errorMessage={error!}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
