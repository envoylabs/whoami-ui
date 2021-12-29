import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
// import { useTokenList } from 'hooks/tokens'
import { usePreferredAlias } from 'hooks/preferredAlias'
import Link from 'next/link'
import { useSigningClient } from 'contexts/cosmwasm'

const Manage: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const [tokens, setTokens] = useState<Array<string>>([''])
  const [loading, setLoading] = useState(false)

  const { alias, loadingAlias } = usePreferredAlias()
  const { walletAddress, signingClient } = useSigningClient()

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return
    }

    const getTokens = async () => {
      setLoading(true)
      try {
        let tokenList = await signingClient.queryContractSmart(contract, {
          tokens: {
            owner: walletAddress,
          },
        })
        setTokens(tokenList.tokens)
        setLoading(false)
      } catch (e) {
        console.error(e.error)
      }
    }

    getTokens()
  }, [tokens.length])

  return (
    <WalletLoader>
      <h2 className="text-4xl">Welcome back{alias ? ', ' + alias : null}!</h2>
      <h1 className="text-6xl font-bold">Manage your tokens</h1>
      {tokens !== undefined ? (
        <ul>
          {tokens.map((token, key) => {
            return (
              <li
                className="card bordered border-secondary hover:border-primary p-6 m-8"
                key={key}
              >
                <Link href={`/tokens/${token}/view`} passHref>
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
    </WalletLoader>
  )
}

export default Manage
