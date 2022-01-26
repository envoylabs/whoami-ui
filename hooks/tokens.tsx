import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { useStore } from 'store/base'

export function useTokenList() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const setStoreTokens = useStore((state) => state.setTokenIds)
  const tokens = useStore((state) => state.tokens)

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
        //setTokens(tokenList.tokens)
        setStoreTokens(tokenList.tokens)
        setLoading(false)
      } catch (e) {
        setStoreTokens([])
        console.log(e)
      }
    }

    getTokens()
  }, [tokens.length, walletAddress])

  return { tokens, loadingTokens }
}
