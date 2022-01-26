import { useState } from 'react'
import { useStore } from 'store/base'
import { connectKeplr } from 'services/keplr'
import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { OptionString } from 'util/types/base'

export interface ISigningCosmWasmClientContext {
  walletAddress: OptionString
  signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
}

const PUBLIC_RPC_ENDPOINT = process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT || ''
const PUBLIC_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  //const [walletAddress, setWalletAddress] = useState('')
  // const [signingClient, setSigningClient] =
  //  useState<SigningCosmWasmClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setSigningClient = useStore((state) => state.setSigningClient)
  const setStoreWalletAddress = useStore((state) => state.setWalletAddress)
  const walletAddress = useStore((state) => state.walletAddress)
  const signingClient = useStore((state) => state.signingClient)

  const connectWallet = async () => {
    setLoading(true)

    try {
      await connectKeplr()

      // enable website to access kepler
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID)

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSignerAuto(
        PUBLIC_CHAIN_ID
      )

      // make client
      const client = await SigningCosmWasmClient.connectWithSigner(
        PUBLIC_RPC_ENDPOINT,
        offlineSigner
      )
      setSigningClient(client)

      // get user address
      const [{ address }] = await offlineSigner.getAccounts()

      // this will definitely be set to string
      setStoreWalletAddress(address)

      setLoading(false)
    } catch (error) {
      setError(error)
    }
  }

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect()
    }
    setStoreWalletAddress('')
    setSigningClient(null)
    setLoading(false)
  }

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
  }
}

export const getNonSigningClient = async () => {
  const client = await CosmWasmClient.connect(PUBLIC_RPC_ENDPOINT)
  return client
}
