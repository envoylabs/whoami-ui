import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { NameCard } from 'components/NameCard'
import { Notice } from 'components/Notice'
import { CopyInput } from 'components/CopyInput'
import TokenList from 'components/TokenList'
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
import Loader from 'components/Loader'
import NotFound404 from 'pages/404'
import * as R from 'ramda'

const TokenView: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const router = useRouter()
  const name = router.query.name as string

  const [tokenName, setTokenName] = useState<string | undefined>()
  const [token, setToken] = useState<Metadata>()
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [showPaths, setShowPaths] = useState(false)
  const [paths, setPaths] = useState<string[]>()

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
        setNotFound(true)
        // console.log(e)
        setLoading(false)
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

  // get nested tokens
  useEffect(() => {
    if (!tokenName || !owner) return

    const getPaths = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        const pathsResponse = await client.queryContractSmart(contract, {
          paths_for_token: {
            token_id: tokenName,
            owner: owner,
            limit: 30,
          },
        })
        setPaths(pathsResponse.tokens)
        setLoading(false)
      } catch (e) {
        // console.log(e)
        setLoading(false)
      }
    }

    getPaths()
  }, [tokenName, contract, owner])

  const handleShowSend = () => {
    if (showSend === false) {
      setShowSend(true)
    } else {
      setShowSend(false)
    }
  }

  const handleShowPaths = () => {
    if (showPaths === false) {
      setShowPaths(true)
    } else {
      setShowPaths(false)
    }
  }

  return (
    <>
      { loading && (
        <div className="flex w-full justify-center py-12">
          <Loader />
        </div>
      )}
      {token && tokenName && (
        <div className="py-16">
          <NameCard name={tokenName} token={token as Metadata} />

          <div className="flex flex-wrap justify-center">
            {paths && showPaths && !R.isEmpty(paths) && (
              <div className="flex flex-wrap justify-center w-full pt-6 lg:w-1/2">
                <div className="py-4">
                  <h2 className="flex text-4xl w-full font-bold justify-center">
                    Paths
                  </h2>
                  <div className="flex w-full justify-center">
                    <TokenList
                      tokenIds={paths}
                      alias={undefined}
                      isPublic={true}
                    />
                  </div>
                </div>
              </div>
            )}

            {showSend && (
              <WalletLoader>
                <div className="flex w-full justify-center py-6 lg:w-1/2">
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
          </div>

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
            <div className="p-1">
              <button className="btn mt-6" onClick={handleShowPaths}>
                Show Paths
              </button>
            </div>
            {!showSend && (
              <div className="p-1">
                <button
                  className="btn btn-primary hover:text-base-100 mt-6"
                  onClick={handleShowSend}
                >
                  Send Funds/Message
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      { notFound && <NotFound404 /> }
    </>
  )
}

export default TokenView
