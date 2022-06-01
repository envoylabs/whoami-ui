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

  const [owner, setOwner] = useState()

  const { signingClient } = useSigningClient()
  const walletAddress = useStore((state) => state.walletAddress)

  useEffect(() => {
    if (!signingClient) {
      return
    }

    const getToken = async () => {
      setLoading(true)
      try {
        let allInfo = await signingClient.queryContractSmart(contract, {
          all_nft_info: {
            token_id: tokenId,
          },
        })

        setStoreToken(allInfo.info.extension)
        setOwner(allInfo.access.owner)

        setLoading(false)
      } catch (e) {
        setStoreToken(null)
        setNotFound(true)
        console.log(e)
      }
    }

    getToken()
  }, [tokenId, walletAddress])

  return { token, loadingToken, notFound, owner }
}
