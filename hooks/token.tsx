import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'

export function useToken(token_id: string) {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const [token, setToken] = useState<string>()
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
            token_id: token_id,
          },
        })
        setToken(tokenInfo)
        setLoading(false)
      } catch (e) {
        console.error(e.error)
      }
    }

    getToken()
  })

  return { token, loadingToken }
}
