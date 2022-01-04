import { ReactNode } from 'react'
import Head from 'next/head'
import Nav from './Nav'
import Link from 'next/link'
import { ClipboardIcon } from '@heroicons/react/solid'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="description" content="The Decentralized Name Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />
      <main className="flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center">
        {children}
      </main>
      <footer className="flex flex-wrap items-center justify-center md:w-1/2 h-24 border-t">
        <div className="flex flex-row break-after-auto pt-4">
          Powered by{' '}
          <a
            className="pl-1 link link-primary link-hover"
            href="https://github.com/cosmos/cosmjs"
          >
            CosmJS
          </a>
          ,
          <a
            className="pl-1 link link-primary link-hover"
            href="https://github.com/cosmoscontracts/juno"
          >
            Juno
          </a>
          <span className="pl-1"> and</span>
          <a
            className="pl-1 link link-primary link-hover"
            href="https://keplr.app/"
          >
            Keplr
          </a>
          .
        </div>
        <div className="text-center pb-4">
          <p>
            This is <strong>alpha software</strong>. By using it, you are
            agreeing to the
            <Link href={'/tcs'} passHref>
              <a className="pl-1 link link-primary link-hover">
                Terms and Conditions of use
              </a>
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
