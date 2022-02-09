import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import PageLink from 'components/PageLink'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { useRouter } from 'next/dist/client/router'
import TokenList from 'components/TokenList'
import Loader from 'components/Loader'
import { isPath, isToken } from 'hooks/tokens'
import * as R from 'ramda'

const ListUsernames: NextPage = () => {
  const router = useRouter()
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const address = router.query.address as string

  const [alias, setAlias] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!address) return

    const getAlias = async () => {
      setLoading(true)

      try {
        const client = await getNonSigningClient()
        let aliasResponse = await client.queryContractSmart(contract, {
          primary_alias: {
            address: address,
          },
        })
        setAlias(aliasResponse.username)
        setLoading(false)
      } catch (e) {
        // console.log(e)
      }
    }

    getAlias()
  }, [address, contract])

  const [tokens, setTokens] = useState<Array<string>>([])
  const [paths, setPaths] = useState<Array<string>>([])

  useEffect(() => {
    if (!address) return

    const getTokens = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        let tokenList = await client.queryContractSmart(contract, {
          tokens: {
            owner: address,
            limit: 30,
          },
        })

        if (!R.isNil(tokenList.tokens) || !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths

          const returnedTokens = R.filter(isToken, tokenList.tokens)
          const returnedPaths = R.filter(isPath, tokenList.tokens)

          setTokens(returnedTokens)
          setPaths(returnedPaths)
        }
        setLoading(false)
      } catch (e) {
        // console.log(e)
      }
    }

    getTokens()
  }, [address, contract])

  return (
    <>
      {!loading && alias ? (
        <div className="flex flex-col justify-center pt-6">
          <h1 className="text-3xl font-bold pt-16">
            Names for <code>{address}</code>
          </h1>
          {tokens === undefined || R.isEmpty(tokens) ? (
            <p className="pt-6">No tokens</p>
          ) : (
            <div className="flex flex-wrap w-full justify-center pt-6">
              <div className="flex w-full lg:w-1/2 flex-col justify-start py-6 align-top">
                <h2 className="flex text-4xl w-full font-bold justify-center">
                  Names
                </h2>
                <div className="flex w-full justify-center">
                  <TokenList tokenIds={tokens} alias={alias} isPublic={true} />
                </div>
              </div>

              {!R.isEmpty(paths) && (
                <div className="flex w-full lg:w-1/2 flex-col justify-start py-6 align-top">
                  <h2 className="flex text-4xl w-full font-bold justify-center">
                    Paths
                  </h2>
                  <div className="flex w-full justify-center">
                    <TokenList tokenIds={paths} alias={alias} isPublic={true} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full justify-center py-12">
          <Loader />
        </div>
      )}
    </>
  )
}

export default ListUsernames
