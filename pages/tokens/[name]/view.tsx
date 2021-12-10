import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import NameCard from 'components/NameCard'
import { useSigningClient } from 'contexts/cosmwasm'
import { useToken } from 'hooks/token'
import { usePreferredAlias } from 'hooks/preferredAlias'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

const TokenView: NextPage = () => {
  const { walletAddress } = useSigningClient()
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)
  const { alias, loadingAlias } = usePreferredAlias()

  console.log(tokenName)
  console.log(alias)

  if (!tokenName) {
    return null
  }

  return (
    <WalletLoader>
      <NameCard name={tokenName} token={token} />
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

        {alias !== tokenName ? (
          <div className="p-1">
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`Set as primary`}</p>
            </a>
          </div>
        ) : null}
      </div>
    </WalletLoader>
  )
}

export default TokenView
