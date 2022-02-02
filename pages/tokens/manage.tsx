import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useTokenList } from 'hooks/tokens'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import Link from 'next/link'
import { useSigningClient } from 'contexts/cosmwasm'
import * as R from 'ramda'

const Manage: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const { tokens, paths } = useTokenList()

  const { walletAddress, signingClient } = useSigningClient()
  const { alias, loadingAlias } = usePrimaryAlias()

  return (
    <WalletLoader>
      <div className="flex flex-col justify-center pt-6">
        <h2 className="text-4xl pt-16">
          Welcome back{alias ? ', ' + alias : null}!
        </h2>

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
    </WalletLoader>
  )
}

export default Manage
