import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { Metadata } from 'util/types/messages'

export function useToken(tokenId: string) {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const [token, setToken] = useState<Metadata>()
  const [loadingToken, setLoading] = useState(false)

  const { signingClient } = useSigningClient()

  useEffect(() => {
    if (!signingClient) {
      return
    }

    const getToken = async () => {
      setLoading(true)
      try {
        let tokenInfo = await signingClient.queryContractSmart(contract, {
          nft_info: {
            token_id: tokenId,
          },
        })
        setToken(tokenInfo.extension)
        setLoading(false)
      } catch (e) {
        console.error(e.error)
      }
    }

    getToken()
  }, [tokenId])

  return { token, loadingToken }
}
