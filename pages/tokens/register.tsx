import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import NameSearch from 'components/NameSearch'
import { useEffect, useState } from 'react'
import { useSigningClient } from 'contexts/cosmwasm'
import { Metadata } from 'util/types/messages'
import TokenSearchResult from 'components/TokenSearchResult'
import Loader from 'components/Loader'

const Register: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [token, setToken] = useState<Metadata | undefined>()
  const [loading, setLoading] = useState(false)

  const { signingClient } = useSigningClient()

  useEffect(() => {
    if (!signingClient) {
      return
    }
    const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

    const doLoad = async (name: string) => {
      setLoading(true)
      try {
        // If this query fails it means that the token does not exist.
        const token = await signingClient.queryContractSmart(contract, {
          nft_info: {
            token_id: name,
          },
        })
        setToken(token.extension)
      } catch (e) {
        setToken(undefined)
      }
      setLoading(false)
    }
    doLoad(searchQuery)
  }, [searchQuery])

  return (
    <WalletLoader>
      <h1 className="text-6xl font-bold mb-2">Find a name</h1>
      <NameSearch query={searchQuery} setQuery={setSearchQuery} />
      {searchQuery !== '' ? (
        <>
          <div className="mt-6 mb-6">
            {loading ? (
              <Loader />
            ) : (
              <TokenSearchResult
                name={searchQuery}
                token={token}
                avaliable={!token}
              />
            )}
          </div>
        </>
      ) : null}
    </WalletLoader>
  )
}

export default Register
