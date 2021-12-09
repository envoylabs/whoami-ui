import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useToken } from 'hooks/token'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

const TokenView: NextPage = () => {
  const router = useRouter()
  const tokenName = router.query.name as string
  const { token } = useToken(tokenName)
  const stringified = JSON.stringify(token, null, 2)

  if (!tokenName) {
    return null
  }

  return (
    <WalletLoader>
      <h2 className="text-4xl">Token Info</h2>
      <h1 className="text-6xl font-bold">{tokenName}</h1>
      {token ? (
        <div className="mockup-code p-3 mt-6" data-prefix="">
          <pre className="text-left">
            <code>{stringified}</code>
          </pre>
        </div>
      ) : null}

      <Link href={`/tokens/${tokenName}/update`} passHref>
        <a>
          <p className="font-bold flex">{`Update metadata for ${tokenName}`}</p>
        </a>
      </Link>
    </WalletLoader>
  )
}

export default TokenView
