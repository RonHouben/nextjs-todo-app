import * as admin from 'firebase-admin'

interface FirebaseAdminResult {
  app: admin.app.App
  firestore: admin.firestore.Firestore
  serverTimestamp: admin.firestore.FieldValue
  getDataWithId: <T>(doc: admin.firestore.DocumentSnapshot) => T
}

export default function firebaseAdmin(): FirebaseAdminResult {
  // Initialize Firebase if not yet initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // replace is needed to parse the "\n" characters from the environment variable
        privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        ),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
    })
  }

  const getDataWithId = <T>(doc: admin.firestore.DocumentSnapshot): T => {
    return ({
      ...doc.data(),
      id: doc.id,
    } as unknown) as T
  }

  return {
    app: admin.app(),
    firestore: admin.firestore(),
    serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    getDataWithId,
  }
}
