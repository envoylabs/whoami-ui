import type { NextPage } from 'next'
import NameSearch from 'components/NameSearch'
import { useEffect, useState } from 'react'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { Metadata } from 'util/types/messages'
import TokenSearchResult from 'components/TokenSearchResult'
import { CopyInput } from 'components/CopyInput'
import Loader from 'components/Loader'

// TODO - make this functionally distinct from register
const Search: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const [searchQuery, setSearchQuery] = useState('')
  const [token, setToken] = useState<Metadata | undefined>()
  const [loading, setLoading] = useState(false)
  const [tokenName, setTokenName] = useState<string | undefined>()
  const [owner, setOwner] = useState<string | undefined>()

  useEffect(() => {
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
        setTokenName(name)
      } catch (e) {
        setToken(undefined)
        setOwner(undefined)
        setTokenName(undefined)
      }
      setLoading(false)
    }
    doLoad(searchQuery)
  }, [searchQuery, contract])

  useEffect(() => {
    if (!tokenName) return

    const getOwner = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        let owner = await client.queryContractSmart(contract, {
          owner_of: {
            token_id: tokenName,
          },
        })
        setOwner(owner.owner)
        setLoading(false)
      } catch (e) {
        // console.log(e)
        setLoading(false)
        setOwner(undefined)
      }
    }

    getOwner()
  }, [tokenName, contract])

  return (
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
              <>
                <TokenSearchResult
                  name={searchQuery}
                  token={token}
                  avaliable={!token}
                  valid={searchQuery.length < 21 ? true : false}
                  loggedIn={false}
                />
                {owner && (
                  <div className="flex w-full justify-center">
                  <div className="py-4">
                    <CopyInput inputText={owner!} label={'Copy'} />
                  </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Search
