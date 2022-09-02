import { ReactNode, useState, useEffect } from 'react'
import { useSigningClient } from 'contexts/cosmwasm'
import Loader from './Loader'
import { isKeplrInstalled } from 'services/keplr'
import { useStore } from 'store/base'
import Link from 'next/link'

function WalletLoader({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  const { loading: clientLoading, error, connectWallet } = useSigningClient()

  const signingClient = useStore((state) => state.signingClient)

  const [keplrInstalled, setKeplrInstalled] = useState<boolean | undefined>()

  useEffect(() => {
    setKeplrInstalled(isKeplrInstalled())
  }, [])

  if (loading || clientLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )
  }

  if (!signingClient) {
    const actionText = keplrInstalled ? (
      <>
        <p>Please connect your Keplr wallet to continue.</p>
        <p>
          By connecting, you accept the{' '}
          <Link href={'/tcs'} passHref>
            <a className="pl-1 link link-primary link-hover">
              Terms and Conditions of use
            </a>
          </Link>
          .
        </p>
      </>
    ) : (
      <>
        <p>
          Please connect your{' '}
          <a href="https://keplr.app" className="link">
            Keplr wallet
          </a>{' '}
          to continue
        </p>
      </>
    )
    const actionButton = keplrInstalled ? (
      <button className="btn btn-primary" onClick={connectWallet}>
        <h3>Connect your wallet</h3>
      </button>
    ) : (
      <a href="https://keplr.app" className="btn btn-primary">
        <h3>GetKeplr</h3>
      </a>
    )
    return (
      <>
        {children}
        <div className="modal modal-open">
          <div className="modal-box">
            {actionText}
            <div className="modal-action justify-center">{actionButton}</div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>
  }

  return <>{children}</>
}

export default WalletLoader
