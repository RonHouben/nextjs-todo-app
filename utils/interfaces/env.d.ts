declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'

      // Firebase variables
      FIREBASE_API_KEY: string
      FIREBASE_AUTH_DOMAIN: string
      FIREBASE_PROJECT_ID: string
      FIREBASE_DB_URL: string
      FIREBASE_STORAGE_BUCKET: string
      FIREBASE_MESSAGING_SENDER_ID: string
      FIREBASE_APP_ID: string
      FIREBASE_MEASUREMENT_ID: string
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: string
      FIREBASE_CLIENT_EMAIL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
