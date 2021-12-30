import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { NameCard } from 'components/NameCard'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { useToken } from 'hooks/token'
import { usePrimaryAlias } from 'hooks/primaryAlias'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Metadata } from 'util/types/messages'
import { useTokenList } from 'hooks/tokens'

const TokenView: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const router = useRouter()
  const tokenName = router.query.name as string

  const [token, setToken] = useState<Metadata>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!tokenName) return

    const getToken = async () => {
      setLoading(true)
      try {
        const client = await getNonSigningClient()
        let tokenInfo = await client.queryContractSmart(contract, {
          nft_info: {
            token_id: tokenName,
          },
        })
        setToken(tokenInfo.extension)
        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    }

    getToken()
  }, [tokenName])

  return (
    <>
      {token ? (
        <>
          <NameCard name={tokenName} token={token as Metadata} />
          <div className="flex flex-wrap">
            <div className="p-1">
              <Link href={`/ids/search`} passHref>
                <a className="btn btn-outline mt-6">
                  <p className="font-bold flex">{`< Back to search`}</p>
                </a>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-6xl font-bold">Not found</h1>
      )}
    </>
  )
}

export default TokenView
