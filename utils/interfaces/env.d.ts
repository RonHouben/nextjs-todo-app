declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'

      // FIREBASE_ACCOUNT_TYPE: string
      FIREBASE_PROJECT_ID: string
      FIREBASE_DB_URL: string
      // FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: string
      FIREBASE_CLIENT_EMAIL: string
      // FIREBASE_CLIENT_ID: string
      // FIREBASE_AUTH_URI: string
      // FIREBASE_TOKEN_URI: string
      // FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string
      // FIREBASE_CLIENT_X509_CERT_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
