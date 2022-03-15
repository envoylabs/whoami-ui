import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getNonSigningClient } from 'hooks/cosmwasm'
import { getJunoAddress } from 'util/conversion'
import { getTokens } from 'util/query'

// this should handle any cosmos address
const handler = async (req: VercelRequest, res: VercelResponse) => {
  const { address } = req.query

  const junoAddress = getJunoAddress(address as string)

  try {
    const primaryAlias = await getTokens(junoAddress as string)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(primaryAlias)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

export default handler
