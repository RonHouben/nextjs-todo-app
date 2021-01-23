declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";

      // Firebase variables
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_DB_URL: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLICFIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST?: string;

      // Github signin provider variables
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;

      // Google signin provider variables
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
