import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import TokenList from 'components/TokenList'
import { useTokenList, noTokens } from 'hooks/tokens'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import Link from 'next/link'
import { useSigningClient } from 'contexts/cosmwasm'
import * as R from 'ramda'

const Manage: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const { tokens, paths, setStartAfter, page, setPage } = useTokenList()

  const { walletAddress, signingClient } = useSigningClient()
  const { alias, loadingAlias } = usePrimaryAlias()

  const [pageStartTokens, setPageStartTokens] = useState<string[]>([])

  useEffect(() => {
    if (noTokens(tokens)) return

    const firstTokenOnCurrentPage = tokens[0]
    if (!R.includes(firstTokenOnCurrentPage, pageStartTokens)) {
      setPageStartTokens(R.append(firstTokenOnCurrentPage, pageStartTokens))
    }
    console.log(pageStartTokens)
  }, [tokens, pageStartTokens])

  const handlePrev = () => {
    if (page === 0) {
      setPage(0)
      setStartAfter(undefined)
    } else {
      const prevPageIndex = page - 1
      setPage(prevPageIndex)

      if (prevPageIndex < pageStartTokens.length) {
        setStartAfter(pageStartTokens[prevPageIndex])
      }
    }
  }

  const handleNext = () => {
    setPage(page + 1)
    setStartAfter(tokens[tokens.length - 1])
  }

  return (
    <WalletLoader>
      <div className="flex flex-col justify-center pt-6">
        <h2 className="text-4xl pt-16">
          Welcome back{alias ? ', ' + alias : null}!
        </h2>

        {noTokens(tokens) ? (
          <p className="pt-6">No tokens</p>
        ) : (
          <div className="flex flex-wrap w-full justify-center pt-6">
            <div className="flex w-full lg:w-1/2 flex-col justify-start py-6 align-top">
              <h2 className="flex text-4xl w-full font-bold justify-center">
                Manage your names
              </h2>
              <div className="flex w-full justify-center">
                <TokenList tokenIds={tokens} alias={alias} isPublic={false} />
              </div>
            </div>

            {!R.isEmpty(paths) && (
              <div className="flex w-full lg:w-1/2 flex-col justify-start py-6 align-top">
                <h2 className="flex text-4xl w-full font-bold justify-center">
                  Manage your paths
                </h2>
                <div className="flex w-full justify-center">
                  <TokenList tokenIds={paths} alias={alias} isPublic={false} />
                </div>
              </div>
            )}

            <div className="flex w-full justify-center">
              <div className="p-1">
                <button className="btn mt-6" onClick={handlePrev}>
                  Previous
                </button>
              </div>
              <div className="p-1">
                <button className="btn mt-6" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WalletLoader>
  )
}

export default Manage
