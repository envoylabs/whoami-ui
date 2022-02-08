import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'
import { Metadata } from 'util/types/messages'
import { useStore } from 'store/base'

export function useToken(tokenId: string) {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const setStoreToken = useStore((state) => state.setToken)
  const token = useStore((state) => state.token)
  //const [token, setToken] = useState<Metadata>()
  const [loadingToken, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)

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
        //setToken(tokenInfo.extension)
        setStoreToken(tokenInfo.extension)
        setLoading(false)
      } catch (e) {
        setStoreToken(null)
        setNotFound(true)
        console.log(e)
      }
    }

    getToken()
  }, [tokenId, walletAddress])

  return { token, loadingToken, notFound }
}
