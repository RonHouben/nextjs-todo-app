import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
  },
  // database: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
} as InitOptions

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
