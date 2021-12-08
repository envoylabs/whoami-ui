import type { NextPage } from 'next'
import Link from 'next/link'
import PageLink from 'components/PageLink'

// I guess we want to use the TokenList component in here
const ListUsernames: NextPage = () => {

  return (
    <WalletLoader>
      <h1 className="text-3xl font-bold">
        Usernames for your address:
      </h1>
    </WalletLoader>
  )
}

export default ListUsernames