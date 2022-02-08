import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { useStore } from 'store/base'
import * as R from 'ramda'

export const isPath = (str: string) => R.includes('::', str)
export const isToken = R.complement(isPath)

// start_after has to be > 1
const getValidQuery = (
  walletAddress: string,
  startAfter: number,
  perPage: number
) => {
  if (startAfter > 1) {
    return {
      tokens: {
        owner: walletAddress,
        start_after: startAfter,
        limit: perPage,
      },
    }
  } else {
    return {
      tokens: {
        owner: walletAddress,
        limit: perPage,
      },
    }
  }
}

export function useTokenList() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const perPage = 1

  const setStoreTokens = useStore((state) => state.setTokenIds)
  const tokens: string[] = useStore((state) => state.tokenIds)

  const setStorePaths = useStore((state) => state.setPathIds)
  const paths: string[] = useStore((state) => state.pathIds)

  //const [tokens, setTokens] = useState<Array<string>>([])
  const [page, setPage] = useState(0)
  const [loadingTokens, setLoading] = useState(false)

  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return
    }

    const getTokens = async () => {
      setLoading(true)

      const startAfter = page * perPage
      const end = startAfter + perPage
      console.log(startAfter)
      const query = getValidQuery(walletAddress, startAfter, end)

      try {
        let tokenList = await signingClient.queryContractSmart(contract, query)

        if (!R.isNil(tokenList.tokens) || !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths

          console.log(tokenList.tokens)
          const returnedTokens = R.filter(isToken, tokenList.tokens)
          const returnedPaths = R.filter(isPath, tokenList.tokens)

          setStoreTokens(returnedTokens)
          setStorePaths(returnedPaths)
        }
        setLoading(false)
      } catch (e) {
        setStoreTokens([])
        console.log(e)
      }
    }

    getTokens()
  }, [tokens.length, walletAddress, page])

  return { tokens, paths, loadingTokens, page, setPage }
}
