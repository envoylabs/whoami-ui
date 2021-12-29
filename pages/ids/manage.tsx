import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useTokenList } from 'hooks/tokens'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import Link from 'next/link'
import { useSigningClient } from 'contexts/cosmwasm'

const Manage: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const { tokens } = useTokenList()

  const { alias, loadingAlias } = usePrimaryAlias()
  const { walletAddress, signingClient } = useSigningClient()

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
    </WalletLoader>
  )
}

export default Manage
