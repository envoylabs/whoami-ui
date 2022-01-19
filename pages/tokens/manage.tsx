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

  const { walletAddress, signingClient } = useSigningClient()
  const { alias, loadingAlias } = usePrimaryAlias()

  return (
    <WalletLoader>
      <div className="flex flex-col justify-center pt-6">
        <h2 className="text-4xl pt-16">
          Welcome back{alias ? ', ' + alias : null}!
        </h2>
        <h2 className="text-4xl font-bold">Manage your names</h2>
        {tokens !== undefined ? (
          <div className="flex w-full justify-center">
            <ul>
              {tokens.map((token, key) => {
                return (
                  <div className="flex w-full justify-center">
                    <li
                      className="card bordered border-secondary hover:border-primary py-4 px-8 mt-6"
                      key={key}
                    >
                      <Link href={`/tokens/${token}`} passHref>
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
    </WalletLoader>
  )
}

export default Manage
