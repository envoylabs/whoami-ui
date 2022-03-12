import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getNonSigningClient } from 'hooks/cosmwasm'

const getNftInfo = async (tokenId: string) => {
  const nonSigningClient = await getNonSigningClient()
  try {
    let nftInfo = await nonSigningClient.queryContractSmart(contract, {
      all_nft_info: {
        token_id: tokenId,
      },
    })
    return nftInfo
  } catch (e) {
    return null
  }
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const { name } = req.query

  try {
    const nftInfo = await getNftInfo(name)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({ data })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
