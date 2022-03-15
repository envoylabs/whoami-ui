import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getNftInfo } from 'util/query'

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
