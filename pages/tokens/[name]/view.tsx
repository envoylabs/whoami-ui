import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import NameCard from 'components/NameCard'
import { useSigningClient } from 'contexts/cosmwasm'
import { useToken } from 'hooks/token'
import { usePreferredAlias } from 'hooks/preferredAlias'
import { defaultExecuteFee } from 'util/fee'
import { defaultMemo } from 'util/memo'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { Metadata } from 'util/types/messages'

const TokenView: NextPage = () => {
  const { walletAddress, signingClient } = useSigningClient()
  const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)
  const { alias, loadingAlias } = usePreferredAlias()

  const { register, handleSubmit } = useForm()

  const onSubmit = async () => {
    if (!signingClient) {
      return
    }

    const msg = {
      update_preferred_alias: {
        token_id: tokenName,
      },
    }

    try {
      let updatedToken = await signingClient.execute(
        walletAddress,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      )
      if (updatedToken) {
        router.push(`/tokens/manage`)
      }
    } catch (e) {
      // TODO env var for dev logging
      // console.log(e)
    }
  }

  if (!tokenName) {
    return null
  }

  return (
    <WalletLoader>
      <NameCard name={tokenName} token={token as Metadata} />
      <div className="flex flex-wrap">
        <div className="p-1">
          <Link href={`/tokens/manage`} passHref>
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`< Back`}</p>
            </a>
          </Link>
        </div>

        <div className="p-1">
          <Link href={`/tokens/${tokenName}/update`} passHref>
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`Update metadata`}</p>
            </a>
          </Link>
        </div>

        {alias || "" !== tokenName && signingClient ? (
          <div className="p-1">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="submit"
                className="btn btn-outline mt-6"
                value="Set as primary"
              />
            </form>
          </div>
        ) : null}
      </div>
    </WalletLoader>
  )
}

export default TokenView
