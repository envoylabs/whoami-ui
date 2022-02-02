import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import PageLink from 'components/PageLink'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { useRouter } from 'next/dist/client/router'
import Loader from 'components/Loader'
import { isPath, isToken } from 'hooks/tokens'
import * as R from 'ramda'

// I guess we want to use the TokenList component in here
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

      console.log(address)

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
                  Manage your names
                </h2>
                <div className="flex w-full justify-center">
                  <ul>
                    {tokens.map((token, key) => {
                      return (
                        <div className="flex w-full justify-center" key={key}>
                          <li className="card bordered border-secondary hover:border-primary py-4 px-8 mt-6">
                            <Link href={`/tokens/${token}`} passHref>
                              <a>
                                <div className="card-title">
                                  <h3 className="text-2xl font-bold flex">
                                    {token}
                                    {alias === token ? (
                                      <div className="badge ml-2 mt-2">
                                        primary
                                      </div>
                                    ) : null}
                                  </h3>
                                </div>
                              </a>
                            </Link>
                          </li>
                        </div>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {!R.isEmpty(paths) && (
                <div className="flex w-full lg:w-1/2 flex-col justify-start py-6 align-top">
                  <h2 className="flex text-4xl w-full font-bold justify-center">
                    Manage your paths
                  </h2>
                  <div className="flex w-full justify-center">
                    <ul>
                      {paths.map((path, key) => {
                        return (
                          <div className="flex w-full justify-center" key={key}>
                            <li className="card bordered border-secondary hover:border-primary py-4 px-8 mt-6">
                              <Link href={`/tokens/${path}`} passHref>
                                <a>
                                  <div className="card-title">
                                    <h3 className="text-2xl font-bold flex">
                                      {path}
                                      {alias === path ? (
                                        <div className="badge ml-2 mt-2">
                                          primary
                                        </div>
                                      ) : null}
                                    </h3>
                                  </div>
                                </a>
                              </Link>
                            </li>
                          </div>
                        )
                      })}
                    </ul>
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
