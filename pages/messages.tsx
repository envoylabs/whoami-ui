import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useTokenList } from 'hooks/tokens'
import { decodeTxRaw } from '@cosmjs/proto-signing'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import Link from 'next/link'
import { useSigningClient } from 'contexts/cosmwasm'
import * as R from 'ramda'

interface Message {
  memo: string
  sender: string
  height: number
}

const addressKey: unique symbol = Symbol()

interface Mapping {
  [addressKey]: string
}

const Messages: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const { alias, loadingAlias } = usePrimaryAlias()
  const { walletAddress, signingClient } = useSigningClient()
  const [loadedAt, setLoadedAt] = useState(new Date())
  const [messages, setMessages] = useState<(Message | undefined)[]>([])
  const [mapping, setMapping] = useState({})

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return
    }

    signingClient
      .searchTx({
        tags: [
          { key: 'transfer.recipient', value: `${walletAddress}` },
          { key: 'message.module', value: 'bank' },
        ],
      })
      .then((response: any) => {
        const pred = (i: any): boolean => !R.isNil(i)

        const msgs = R.filter(
          pred,
          R.map((r) => {
            const decodedTx = decodeTxRaw(r.tx)
            const rawLog = JSON.parse(r.rawLog)

            const bankMsg = R.filter(
              (e: any) => R.equals(e.type, 'message'),
              rawLog[0].events
            )[0]
            const sender = R.filter(
              (attr: any) => R.equals(attr.key, 'sender'),
              bankMsg.attributes
            )[0].value

            if (!R.isEmpty(decodedTx.body.memo)) {
              const message: Message = {
                memo: decodedTx.body.memo,
                sender: sender,
                height: r.height,
              }
              return message
            }
          }, response)
        )

        setMessages(msgs)
        setLoadedAt(new Date())
      })
      .catch((err) => {
        console.log('Error signingClient.searchTx(): ', err)
      })
  }, [signingClient, walletAddress])

  useEffect(() => {
    if (!signingClient || walletAddress.length === 0) {
      return
    }

    const getAliases = async (messages) => {
      try {
        let promises = R.map(async (msg) => {
          try {
            let address = msg.sender

            let aliasResponse = await signingClient.queryContractSmart(
              contract,
              {
                primary_alias: {
                  address: address,
                },
              }
            )

            const newMapping = {}
            newMapping[address] = aliasResponse.username
            setMapping(R.mergeRight(mapping, newMapping))
          } catch (e) {
            console.error(e.message)
          }
        }, messages)
        Promise.all(promises)
      } catch (e) {
        console.error(e.message)
      }
    }

    getAliases(messages)
    //console.log(mapping)
  }, [signingClient, walletAddress, loadedAt])

  const getAliasOrAddr = (address) => mapping[address] || address

  return (
    <WalletLoader>
      <div className="flex flex-col justify-center p-6 pb-16">
        <h2 className="text-4xl p-16">
          Messages for {alias ? alias : walletAddress}
        </h2>
        {!R.isEmpty(messages) ? (
          <div className="flex w-full justify-center">
            <ul>
              {messages.map((msg, key) => {
                if (!R.isEmpty(msg)) {
                  return (
                    <div
                      className="flex flex-wrap w-full justify-center py-4 text-left background-100"
                      key={key}
                    >
                      <div className="flex justify-center w-2/3 py-2">
                        <p className="font-semibold">
                          Sender: {getAliasOrAddr(msg!.sender)}
                        </p>
                      </div>
                      <div className="flex justify-center w-1/3 py-2">
                        <p className="font-semibold">
                          {' '}
                          At height {msg!.height}
                        </p>
                      </div>
                      <div className="flex justify-center w-full border-t border-b py-2">
                        <p>{msg!.memo}</p>
                      </div>
                    </div>
                  )
                }
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col justify-center pt-6">
            <p>No messages</p>
          </div>
        )}
      </div>
    </WalletLoader>
  )
}

export default Messages
