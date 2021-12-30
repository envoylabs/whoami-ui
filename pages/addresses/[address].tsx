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
        console.log(e)
      }
    }

    getAlias()
  }, [address])

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
          },
        })
        setTokens(tokenList.tokens)
        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }

    getTokens()
  }, [address])

  return (
    <>
      {!loading && alias ? (
        <>
          <h1 className="text-3xl font-bold">
            Names for <code>{address}</code>
          </h1>
          {tokens !== undefined ? (
            <ul>
              {tokens.map((token, key) => {
                return (
                  <li
                    className="card bordered border-secondary hover:border-primary p-6 m-8"
                    key={key}
                  >
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
                )
              })}
            </ul>
          ) : (
            <p>No tokens</p>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default ListUsernames
