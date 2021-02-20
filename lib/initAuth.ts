import { init } from 'next-firebase-auth'
import 'firebase/analytics'
import 'firebase/firestore'

const initAuth = () => {
  init({
    authPageURL: '/login',
    appPageURL: '/',
    loginAPIEndpoint: '/api/auth/login', // required
    logoutAPIEndpoint: '/api/auth/logout', // required
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must not be accesssible on the client side.
        privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
          ? process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
              /\\n/g,
              '\n'
            )
          : '',
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
    },
    firebaseClientInitConfig: {
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // required
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
  })
}

export default initAuth
