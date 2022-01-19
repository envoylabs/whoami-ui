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
  }, [searchQuery, signingClient])

  return (
    <WalletLoader>
    <div className="flex flex-col w-full justify-center py-6">
    <div className="flex w-full justify-center">
      <h1 className="text-6xl font-bold mb-2">Find a name</h1>
      </div>
      <div className="flex w-full justify-center">
      <NameSearch query={searchQuery} setQuery={setSearchQuery} />
      </div>
      {searchQuery !== '' ? (
        <>
          <div className="mt-6 mb-6 h-[700px]">
            {loading ? (
              <div className="flex w-full justify-center">
              <Loader />
              </div>
            ) : (
              <TokenSearchResult
                name={searchQuery}
                token={token}
                avaliable={!token}
                valid={searchQuery.length < 21 ? true : false}
                loggedIn={true}
              />
            )}
          </div>
        </>
      ) : null}
      </div>
    </WalletLoader>
  )
}

export default Register
