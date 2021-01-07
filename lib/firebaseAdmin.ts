import admin from 'firebase-admin'

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // replace is needed to parse the "\n" characters from the environment variable
      privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
        /\\n/g,
        '\n'
      ),
    }),
    databaseURL: process.env.FIREBASE_DB_URL,
  })
}

export const getDataWithId = <T>(doc: admin.firestore.DocumentSnapshot): T => {
  return ({
    ...doc.data(),
    id: doc.id,
  } as unknown) as T
}

export const firebaseAdminTimestamp = admin.firestore.Timestamp

export const firestore = admin.firestore()
