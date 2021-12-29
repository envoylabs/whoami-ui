import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'

export function useTokenList() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const [tokens, setTokens] = useState<Array<string>>([])
  const [loadingTokens, setLoading] = useState(false)

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

  return { tokens, loadingTokens }
}
