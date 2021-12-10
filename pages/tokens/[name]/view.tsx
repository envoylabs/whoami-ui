import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import NameCard from 'components/NameCard'
import { useToken } from 'hooks/token'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

const TokenView: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)

  if (!tokenName) {
    return null
  }

  return (
    <WalletLoader>
      <NameCard name={tokenName} token={token} />
      <div className="flex flex-wrap">
        <Link href={`/tokens/${tokenName}/update`} passHref>
          <a className="btn btn-outline mt-6">
            <p className="font-bold flex">{`Update metadata`}</p>
          </a>
        </Link>
      </div>
    </WalletLoader>
  )
}

export default TokenView
