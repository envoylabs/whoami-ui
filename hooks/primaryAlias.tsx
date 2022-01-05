import { useSigningClient } from 'contexts/cosmwasm'
import { useEffect, useState } from 'react'

export function usePrimaryAlias() {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

  const [alias, setAlias] = useState<string>()
  const [loadingAlias, setLoading] = useState(false)

  const { walletAddress, signingClient } = useSigningClient()

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return
    }

    const getAlias = async () => {
      setLoading(true)
      try {
        let aliasResponse = await signingClient.queryContractSmart(contract, {
          primary_alias: {
            address: walletAddress,
          },
        })
        setAlias(aliasResponse.username)
        setLoading(false)
      } catch (e) {
        console.error(e.message)
        return
      }
    }

    getAlias()
  }, [alias, walletAddress])

  return { alias, loadingAlias }
}
