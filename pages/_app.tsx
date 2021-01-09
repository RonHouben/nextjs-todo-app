import { AppProps } from 'next/app'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import '../styles/global.css'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { FirebaseAppProvider } from 'reactfire'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const firebaseAppName: string = 'todo-app'

// only initialize Firebase if it doesn't exist yet
const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig, firebaseAppName)
  : firebase.app(firebaseAppName)

// changing firebaseApp settings to use the local DB when using development environment
if (process.env.NODE_ENV === 'development' && !firebase.apps.length) {
  firebaseApp.firestore().settings({
    host: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST,
    ssl: false,
  })
}

function TodoApp({ Component, pageProps }: AppProps) {
  return (
    <FirebaseAppProvider firebaseApp={firebaseApp}>
      <ThemeProvider
        attribute='class'
        themes={['light', 'dark']}
        defaultTheme='light'
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </FirebaseAppProvider>
  )
}

export default TodoApp
