import create from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

export const useStore = create(
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
