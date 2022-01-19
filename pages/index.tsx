import type { NextPage } from 'next'
import Link from 'next/link'
import WalletLoader from 'components/WalletLoader'
import PageLink from 'components/PageLink'
import { LibraryIcon, MapIcon, PencilIcon } from '@heroicons/react/solid'

const Home: NextPage = () => {
  //const { walletAddress } = useSigningClient()

  return (
    <div className="flex flex-col w-full py-12">
      <h1 className="text-6xl font-bold py-6">
        {process.env.NEXT_PUBLIC_SITE_TITLE}
      </h1>
      <p className="italic">Decentralized Name Service</p>

      <div className="w-full">
        <PageLink
          href="/tokens/register"
          title="Register"
          description="Register and configure a new name"
          Icon={LibraryIcon}
        />
        <PageLink
          href="/tokens/manage"
          title="Manage"
          description="Transfer, edit, or burn a name that you own"
          Icon={PencilIcon}
        />
        <PageLink
          href="/ids/search"
          title="Explore"
          description="Lookup addresses and explore registered names"
          Icon={MapIcon}
        />
      </div>
    </div>
  )
}

export default Home
