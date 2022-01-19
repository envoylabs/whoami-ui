import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import PageLink from 'components/PageLink'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { useRouter } from 'next/dist/client/router'
import Loader from 'components/Loader'
// import WalletLoader from 'components/WalletLoader'

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
        setTokens(tokenList.tokens)
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
          {tokens !== undefined ? (
            <div className="flex w-full justify-center">
              <ul>
                {tokens.map((token, key) => {
                  return (
                    <div className="flex w-full justify-center" key={key}>
                      <li className="card bordered border-secondary hover:border-primary py-4 px-8 mt-6">
                        <Link href={`/ids/${token}`} passHref>
                          <a>
                            <div className="card-title">
                              <h3 className="text-2xl font-bold flex">
                                {token}
                                {alias === token ? (
                                  <div className="badge ml-2 mt-2">primary</div>
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
          ) : (
            <p>No tokens</p>
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
