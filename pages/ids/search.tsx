import type { NextPage } from 'next'
import NameSearch from 'components/NameSearch'
import { useEffect, useState } from 'react'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { Metadata } from 'util/types/messages'
import TokenSearchResult from 'components/TokenSearchResult'
import Loader from 'components/Loader'

// TODO - make this functionally distinct from register
const Search: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [token, setToken] = useState<Metadata | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

    const doLoad = async (name: string) => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        // If this query fails it means that the token does not exist.
        const token = await client.queryContractSmart(contract, {
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
    <>
      <h1 className="text-6xl font-bold mb-2">Find a name</h1>
      <NameSearch query={searchQuery} setQuery={setSearchQuery} />
      {searchQuery !== '' ? (
        <>
          <div className="mt-6 mb-6 h-[700px]">
            {loading ? (
              <Loader />
            ) : (
              <TokenSearchResult
                name={searchQuery}
                token={token}
                avaliable={!token}
                valid={searchQuery.length < 21 ? true : false}
                loggedIn={false}
              />
            )}
          </div>
        </>
      ) : null}
    </>
  )
}

export default Search