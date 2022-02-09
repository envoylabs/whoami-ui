import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { useStore } from 'store/base'
import * as R from 'ramda'

export const isPath = (str: string) => R.includes('::', str)
export const isToken = R.complement(isPath)
export const noTokens = (tokenIds: string[]): boolean =>
  tokenIds === undefined || R.isEmpty(tokenIds)

// start_after has to be > 1
const getValidQuery = (
  walletAddress: string,
  startAfter: string | undefined,
  perPage: number
) => {
  if (startAfter) {
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

// start_after starts after the token_id
// so simply take the last token_id from the last page
// and pass it in with a perPage for the limit arg
// note that 30 is the limit for that
export function useTokenList() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const perPage = 1

  const setStoreTokens = useStore((state) => state.setTokenIds)
  const tokens: string[] = useStore((state) => state.tokenIds)

  const setStorePaths = useStore((state) => state.setPathIds)
  const paths: string[] = useStore((state) => state.pathIds)

  //const [tokens, setTokens] = useState<Array<string>>([])
  const [startAfter, setStartAfter] = useState(undefined)
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

      const query = getValidQuery(walletAddress, startAfter, perPage)

      try {
        let tokenList = await signingClient.queryContractSmart(contract, query)

        if (!R.isNil(tokenList.tokens) && !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths
          console.log(tokenList)
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
  }, [tokens.length, walletAddress, startAfter])

  return { tokens, paths, loadingTokens, startAfter, setStartAfter, page, setPage }
}
