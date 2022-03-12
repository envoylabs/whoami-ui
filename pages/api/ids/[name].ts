import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getNonSigningClient } from 'hooks/cosmwasm'

const CONTRACT = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string

const getNftInfo = async (tokenId: string) => {
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

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { name } = req.query

  try {
    const nftInfo = await getNftInfo(name as string)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(nftInfo)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

export default handler