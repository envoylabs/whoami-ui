import type { NextPage } from 'next'
import NameSearch from 'components/NameSearch'
import { useEffect, useState } from 'react'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { Metadata } from 'util/types/messages'
import TokenSearchResult from 'components/TokenSearchResult'
import { CopyInput } from 'components/CopyInput'
import Loader from 'components/Loader'
import WalletLoader from 'components/WalletLoader'
import { Send } from 'components/Send'
import { useStore } from 'store/base'

// TODO - make this functionally distinct from register
const Search: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const [searchQuery, setSearchQuery] = useState('')
  const [token, setToken] = useState<Metadata | undefined>()
  const [loading, setLoading] = useState(false)
  const [tokenName, setTokenName] = useState<string | undefined>()
  const [owner, setOwner] = useState<string | undefined>()
  const [showSend, setShowSend] = useState(false)

  const client = useStore((state) => state.nonSigningClient)

  useEffect(() => {
    if (!client) return

    const doLoad = async (name: string) => {
      setLoading(true)
      try {
        // If this query fails it means that the token does not exist.
        const token = await client!.queryContractSmart(contract, {
          nft_info: {
            token_id: name,
          },
        })

        if (token) {
          setToken(token.extension)
          setTokenName(name)
        } else {
          setToken(undefined)
          setOwner(undefined)
        }
      } catch (e) {
        setToken(undefined)
        setOwner(undefined)
        setTokenName(undefined)
      }
      setLoading(false)
    }
    doLoad(searchQuery)
  }, [searchQuery, contract, client])

  useEffect(() => {
    if (!tokenName || !client) return

    const getOwner = async () => {
      setLoading(true)
      try {
        let owner = await client!.queryContractSmart(contract, {
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
  }, [tokenName, contract, client])

  const handleShowSend = () => {
    if (showSend === false) {
      setShowSend(true)
    } else {
      setShowSend(false)
    }
  }

  return (
    <div className="flex flex-col w-full justify-center py-12">
      <div className="flex w-full justify-center">
        <h1 className="text-6xl font-bold mb-2 pt-6">Find a name</h1>
      </div>
      <div className="flex w-full justify-center">
        <NameSearch query={searchQuery} setQuery={setSearchQuery} />
      </div>
      {searchQuery !== '' ? (
        <>
          <div className="mt-6 mb-6 min-h-[700px]">
            {loading ? (
              <div className="flex w-full justify-center">
                <Loader />
              </div>
            ) : (
              <div className="flex flex-wrap w-full justify-center">
                <TokenSearchResult
                  name={searchQuery}
                  token={token}
                  avaliable={!token}
                  valid={searchQuery.length < 21 ? true : false}
                  loggedIn={false}
                />
                {owner && (
                  <>
                    {showSend ? (
                      <WalletLoader>
                        <div className="flex w-full lg:w-1/2 justify-center py-6">
                          <div className="py-4">
                            <Send
                              address={owner!}
                              name={tokenName!}
                              showAddress={false}
                            />
                          </div>
                        </div>
                      </WalletLoader>
                    ) : (
                      <div className="flex w-full justify-center py-6">
                        <div>
                          <button
                            className="btn btn-primary hover:text-base-100"
                            onClick={handleShowSend}
                          >
                            Send Funds
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Search
