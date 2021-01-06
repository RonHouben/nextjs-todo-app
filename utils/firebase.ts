import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  appId: process.env.FIREBASE_APP_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

export const appendIds = <T>(
  snapShot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
): T[] => {
  let result: T[] = []

  snapShot.forEach(
    (doc) => (result = [...result, { ...doc.data(), id: doc.id }] as T[])
  )

  return result
}

export const serverValueTimestamp = firebase.database.ServerValue.TIMESTAMP

export default !firebase.apps.length
  ? firebase.initializeApp(config).firestore()
  : firebase.app().firestore()
