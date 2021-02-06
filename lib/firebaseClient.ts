import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseAppName: string = "todo-app";

// initialize Firebase if it doesn't exist yet
export const firebaseClient = initializeFirebaseApp({
  appName: firebaseAppName,
  config: firebaseConfig,
  initiator: firebase,
});

export const firestoreServerTimestamp =
  firebase.firestore.FieldValue.serverTimestamp;

export const providers = {
  github: new firebase.auth.GithubAuthProvider(),
};

interface InitializeFirebaseProps {
  appName: string;
  config: object;
  initiator: typeof firebase;
}

function initializeFirebaseApp({
  appName,
  config,
  initiator,
}: InitializeFirebaseProps): firebase.app.App {
  if (!firebase.apps.length) {
    // initialize app
    const app = initiator.initializeApp(config, appName);
    // changing firebaseApp settings to use the local DB when using development environment
    if (process.env.NODE_ENV === "development") {
      // app.firestore().settings({
      //   host: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST,
      //   ssl: false,
      // });
    }
    // enable services only when the code is running in the browser (on the client)
    if (process.browser) {
      try {
        // enable offline synchronizing
        app.firestore().enablePersistence();
        // Initialize Google Analytics and get a reference to the service
        app.analytics().logEvent("[Firebase Analytics] initialized");
      } catch (error) {
        console.error(error.message);
        return app;
      }
    }
    // return app
    return app;
  } else {
    // return existing app
    return initiator.app(appName);
  }
}
