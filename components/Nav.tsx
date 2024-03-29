import { useSigningClient } from 'contexts/cosmwasm'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from 'components/ThemeToggle'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { InboxInIcon } from '@heroicons/react/outline'
import { useStore } from 'store/base'
import { getNonSigningClient } from 'hooks/cosmwasm'

function Nav() {
  const router = useRouter()
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const [loading, setLoading] = useState(false)

  const walletAddress = useStore((state) => state.walletAddress)
  const alias = useStore((state) => state.primaryAlias)
  const setAlias = useStore((state) => state.setPrimaryAlias)
  const setNonSigningClient = useStore((state) => state.setNonSigningClient)

  // on first load, init the non signing client
  useEffect(() => {
    const initNonSigningClient = async () => {
      const nonSigningClient = await getNonSigningClient()
      setNonSigningClient(nonSigningClient)
    }

    initNonSigningClient()
  }, [setNonSigningClient])

  const { connectWallet, disconnect, signingClient } = useSigningClient()
  const handleConnect = () => {
    if (!walletAddress || walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
      setAlias(null)
    }
  }

  const reconnect = useCallback(() => {
    disconnect()
    setAlias(null)
    connectWallet()
  }, [disconnect, connectWallet, setAlias])

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', reconnect)

    return () => {
      window.removeEventListener('keplr_keystorechange', reconnect)
    }
  }, [reconnect])

  useEffect(() => {
    if (!signingClient || !walletAddress) {
      return
    }

    const getAlias = async () => {
      setLoading(true)
      try {
        let aliasResponse = await signingClient.queryContractSmart(contract, {
          primary_alias: {
            address: walletAddress,
          },
        })
        setAlias(aliasResponse.username)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        setAlias(null)
        // console.log(e)
        return
      }
    }

    getAlias()
  }, [alias, walletAddress, contract, signingClient, setAlias])

  const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || ''

  return (
    <div className="border-b w-screen px-2 md:px-16">
      <nav className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a>
              {PUBLIC_SITE_ICON_URL.length > 0 ? (
                <Image
                  src={PUBLIC_SITE_ICON_URL}
                  height={32}
                  width={32}
                  alt="Logo"
                />
              ) : (
                <span className="text-2xl">⚛️ </span>
              )}
            </a>
          </Link>
          <Link href="/">
            <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">
              {process.env.NEXT_PUBLIC_SITE_TITLE}
            </a>
          </Link>
        </div>
        <ThemeToggle />
        <div className="px-4 flex flex-grow lg:flex-grow-0 max-w-full">
          <button
            className="block btn btn-outline btn-primary w-full max-w-full truncate normal-case"
            onClick={handleConnect}
          >
            {alias || walletAddress || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
