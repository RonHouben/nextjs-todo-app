// import the script that gets the firebases config options.
// This is done so the secrets can be taken from the `.env.local` file
importScripts("./sw-env-vars.js");
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in
// occording to Google it's save to keep these details in here
firebase.initializeApp({
  projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();

// listen to new messages
firebase.messaging().onBackgroundMessage((payload) => {
  console.log("background msg", payload);
});
