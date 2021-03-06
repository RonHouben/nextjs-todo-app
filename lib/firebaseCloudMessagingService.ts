import { createStandaloneToast } from '@chakra-ui/toast'
import firebase from 'firebase/app'
import 'firebase/messaging'
const toast = createStandaloneToast({
  defaultOptions: { position: 'top-right' },
})

export default class FirebaseCloudMessagingService {
  public FCMToken: string | undefined

  public async init(): Promise<void> {
    // try to get the token from localStorage and return it
    const localFCMToken = localStorage.getItem('fcm_token')

    if (localFCMToken) {
      this.FCMToken = localFCMToken
      return
    }

    // ask notification permissions if there's no FCM token in the localStorage
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      console.info('notification permissions granted')

      const FCMToken = await firebase.messaging().getToken()

      localStorage.setItem('fcm_token', FCMToken)

      this.FCMToken = FCMToken

      return
    }
    if (permission === 'denied') {
      console.warn('Please allow notifications for the best user experience')
      toast({
        status: 'warning',
        description: 'Please allow notifications for the best user experience',
      })
    }
  }

  public listenForMessages(): void {
    if (this.FCMToken) {
      firebase.messaging().onMessage((payload) => {
        const { title, body } = payload.notification

        toast({ status: 'info', title, description: body })
      })
    } else {
      toast({
        status: 'error',
        description:
          'No FCM token found. Initialization of Firebase Cloud Messaging probably went wrong',
      })
      throw new Error('No FCM token found. Initialization probably went wrong')
    }
  }
}
