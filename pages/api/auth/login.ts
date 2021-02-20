import { NextApiRequest, NextApiResponse } from 'next'
import { setAuthCookies } from 'next-firebase-auth'
import initAuth from '../../../lib/initAuth'

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setAuthCookies(req, res)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
  return res.status(200).json({ success: true })
}

export default handler
