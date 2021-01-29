import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging";
import { toast } from "react-toastify";
import { getSession } from "next-auth/client";

const firebaseConfig = {
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
export const firebaseApp = initializeFirebaseApp({
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

        // app.messaging();
        const permission = getNotificationPermissions();

        permission.then((permission) => {
          switch (permission) {
            case "granted":
              console.info("notification permissions granted");
              toast("Thanks for enabling notification!", { type: "success" });

              // get FCM token
              const messaging = app.messaging();
              messaging
                .getToken({
                  vapidKey:
                    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_VAPID_KEY,
                })
                .then(async (token) => {
                  const session = await getSession();

                  if (session && session.userId) {
                    console.log("userid", session.userId);
                    console.log("FCM Token", token);
                    app
                      .firestore()
                      .collection("users")
                      .doc(session.userId)
                      .update({
                        FCMToken: token,
                        updatedAt: firestoreServerTimestamp(),
                      });
                  }
                });
              break;
            case "denied":
              console.warn("user denied notification permissions");
              toast("Please make sure to accept the notifications", {
                type: "warning",
              });
              break;
            case "default":
              console.warn(
                "[firebaseClient][notificatioonPermisssions] reached default case"
              );
              toast("Something  went wrong", { type: "warning" });
              break;
          }
        });
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

async function getNotificationPermissions() {
  try {
    return Notification.requestPermission();
  } catch (error) {
    if (error instanceof TypeError) {
      Notification.requestPermission((token) => {
        console.log("token safari", token);
      });
    } else {
      throw error;
    }
  }
}
