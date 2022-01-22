import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { NameCard } from 'components/NameCard'
import { Notice } from 'components/Notice'
import { CopyInput } from 'components/CopyInput'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { useToken } from 'hooks/token'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Metadata } from 'util/types/messages'
import { useTokenList } from 'hooks/tokens'
import WalletLoader from 'components/WalletLoader'
import { Send } from 'components/Send'

const TokenView: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const router = useRouter()
  const name = router.query.name as string
  const [tokenName, setTokenName] = useState<string | undefined>()

  const [token, setToken] = useState<Metadata>()
  const [loading, setLoading] = useState(false)
  const [showSend, setShowSend] = useState(false)

  useEffect(() => {
    if (!name) return

    const amendedName = name.replace(/^dens::/i, '')
    setTokenName(amendedName)
  }, [name])

  useEffect(() => {
    if (!tokenName) return

    const getToken = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        const tokenInfo = await client.queryContractSmart(contract, {
          nft_info: {
            token_id: tokenName,
          },
        })
        setToken(tokenInfo.extension)
        setLoading(false)
      } catch (e) {
        // console.log(e)
      }
    }

    getToken()
  }, [tokenName, contract])

  const [owner, setOwner] = useState()

  useEffect(() => {
    if (!tokenName) return

    const getOwner = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        let owner = await client.queryContractSmart(contract, {
          owner_of: {
            token_id: tokenName,
          },
        })
        setOwner(owner.owner)
        setLoading(false)
      } catch (e) {
        // console.log(e)
        setLoading(false)
      }
    }

    getOwner()
  }, [tokenName, contract])

  const handleShowSend = () => {
    if (showSend === false) {
      setShowSend(true)
    } else {
      setShowSend(false)
    }
  }

  return (
    <>
      {token ? (
        <div className="py-16">
          <NameCard name={tokenName!} token={token as Metadata} />
          {showSend && (
            <WalletLoader>
              <div className="flex w-full justify-center py-6">
                <div className="py-4">
                  <Send
                    address={owner!}
                    name={tokenName!}
                    showAddress={false}
                  />
                </div>
              </div>
            </WalletLoader>
          )}
          {owner && !showSend && (
            <div className="flex flex-wrap justify-center w-full">
              <div className="py-4">
                <CopyInput inputText={owner!} label={'Copy'} />
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center">
            <div className="p-1">
              <Link href={`/ids/search`} passHref>
                <a className="btn btn-outline mt-6">
                  <p className="font-bold flex">{`< Back to search`}</p>
                </a>
              </Link>
            </div>
            {!showSend && (
              <div className="p-1">
                <button
                  className="btn btn-primary hover:text-base-100 mt-6"
                  onClick={handleShowSend}
                >
                  Send Funds
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold">Not found</h1>
      )}
    </>
  )
}

export default TokenView
