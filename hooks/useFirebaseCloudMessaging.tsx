import firebase from 'firebase/app'
import { useEffect } from 'react'
import FirebaseCloudMessagingService from '../lib/firebaseCloudMessagingService'

export default function useFirebaseCloudMessaging() {
  useEffect(() => {
    const cloudMessaging = new FirebaseCloudMessagingService()

    setToken()

    async function setToken() {
      // initiate Firebase Cloud Messaging Service
      await cloudMessaging.init()
      // listen for new for ground messages and show a toast for each
      if (firebase.messaging.isSupported()) {
        cloudMessaging.listenForMessages()
      }
    }
  }, [])
}
