import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { setAuthCookies } from 'next-firebase-auth'
import firebaseAdmin from '../../../lib/firebaseAdmin'
import initAuth from '../../../lib/initAuth'
import { IUser } from '../../../utils/interfaces/user'

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setAuthCookies(req, res)

    if (!req.headers.authorization) {
      return res
        .status(400)
        .json({ error: 'Missing JWT in authorization headers' })
    }

    const token = req.headers.authorization

    const { user_id: uid, name } = jwt.decode(token) as { [key: string]: any }

    // check if the user already exists in the database
    const user = await firebaseAdmin()
      .firestore.collection('users')
      .doc(uid)
      .get()

    if (!user.exists) {
      // add user to the DB
      firebaseAdmin()
        .firestore.collection('users')
        .doc(uid)
        .set({
          name,
        } as IUser)
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
  return res.status(200).json({ success: true })
}

export default handler
