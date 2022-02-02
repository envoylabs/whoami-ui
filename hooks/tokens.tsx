import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { useStore } from 'store/base'
import * as R from 'ramda'

export const isPath = (str: string) => R.includes('::', str)
export const isToken = R.complement(isPath)

export function useTokenList() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const setStoreTokens = useStore((state) => state.setTokenIds)
  const tokens: string[] = useStore((state) => state.tokenIds)

  const setStorePaths = useStore((state) => state.setPathIds)
  const paths: string[] = useStore((state) => state.pathIds)

  //const [tokens, setTokens] = useState<Array<string>>([])
  const [loadingTokens, setLoading] = useState(false)

  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)

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
            limit: 30,
          },
        })

        if (!R.isNil(tokenList.tokens) || !R.isEmpty(tokenList.tokens)) {
          // filter tokens and paths

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
  }, [tokens.length, walletAddress])

  return { tokens, paths, loadingTokens }
}
