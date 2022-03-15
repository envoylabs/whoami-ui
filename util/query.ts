import { getNonSigningClient } from 'hooks/cosmwasm'

const CONTRACT = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

export const getNftInfo = async (tokenId: string) => {
  const nonSigningClient = await getNonSigningClient()
  try {
    let nftInfo = await nonSigningClient.queryContractSmart(CONTRACT, {
      all_nft_info: {
        token_id: tokenId,
      },
    })
    return nftInfo
  } catch (e) {
    return null
  }
}

export const getPrimaryAlias = async (address: string) => {
  const nonSigningClient = await getNonSigningClient()
  try {
    let aliasResponse = await nonSigningClient.queryContractSmart(CONTRACT, {
      primary_alias: {
        address: address,
      },
    })
    return aliasResponse
  } catch (e) {
    return null
  }
}

export const getTokens = async (address: string, limit: number = 30) => {
  const nonSigningClient = await getNonSigningClient()
  try {
    let tokenList = await nonSigningClient.queryContractSmart(CONTRACT, {
      tokens: {
        owner: address,
        limit: limit,
      },
    })

    return tokenList
  } catch (e) {
    return []
  }
}
