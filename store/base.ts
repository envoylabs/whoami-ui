import create from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { Metadata } from 'util/types/messages'
import { OptionString } from 'util/types/base'

type SCWClientOrNull = SigningCosmWasmClient | null
type CWClientOrNull = CosmWasmClient | null

interface State {
  // fields
  signingClient: SCWClientOrNull
  nonSigningClient: CWClientOrNull
  primaryAlias: OptionString
  walletAddress: OptionString
  token: Metadata | null
  tokenIds: string[]
  tokens: [Metadata[]]

  // functions
  setSigningClient: (c: SCWClientOrNull) => void
  setNonSigningClient: (c: CWClientOrNull) => void
  setPrimaryAlias: (alias: OptionString) => void
  setWalletAddress: (address: string) => void
  setToken: (t: Metadata | null) => void
  appendTokenId: (tid: string) => void
  setTokenIds: (tids: string[]) => void
  appendToken: (t: Metadata) => void
  setTokens: (ts: Metadata[]) => void
}

const useStore = create<State>(
  devtools(
    persist(
      (set) => ({
        signingClient: null,
        setSigningClient: (client) =>
          set((state) => ({ signingClient: client })),
        nonSigningClient: null,
        setNonSigningClient: (client) =>
          set((state) => ({ nonSigningClient: client })),
        primaryAlias: null,
        setPrimaryAlias: (alias) => set((state) => ({ primaryAlias: alias })),
        walletAddress: null,
        setWalletAddress: (address) =>
          set((state) => ({ walletAddress: address })),
        token: null,
        setToken: (token) => set((state) => ({ token: token })),
        tokenIds: [],
        appendTokenId: (token) =>
          set((state) => ({ tokens: tokens.push(token) })),
        setTokenIds: (tokens) => set((state) => ({ tokens: tokens })),
        tokens: [],
        appendToken: (token) =>
          set((state) => ({ tokens: tokens.push(token) })),
        setTokens: (tokens) => set((state) => ({ tokens: tokens })),
      }),
      {
        name: 'dens-storage',
        getStorage: () => localStorage,
      }
    )
  )
)

export { useStore, State }
