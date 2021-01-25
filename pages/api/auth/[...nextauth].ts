import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import { SessionBase } from "next-auth/_utils";
import FirebaseAdapter, { IUser } from "../../../lib/firebaseAdapter";
import firebaseAdmin from "../../../lib/firebaseAdmin";

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      state: false,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      state: false,
    }),
  ],
  //@ts-ignore
  adapter: FirebaseAdapter.Adapter({
    firestoreAdmin: firebaseAdmin().firestore,
    usersCollection: "users",
    accountsCollection: "accounts",
    sessionsCollection: "sessions",
    verificationRequestsCollection: "verificationRequests",
  }),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: async (session: SessionBase, user: IUser) => {
      const updatedSession = {
        ...session,
        userId: user.id,
      };

      return Promise.resolve(updatedSession);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
