import { createStandaloneToast } from '@chakra-ui/toast'

const toast = createStandaloneToast({
  defaultOptions: { position: 'top-right' },
})

export default function register() {
  if (process.browser && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `service-worker.js`
      let isAppOnline = navigator.onLine

      window.addEventListener('online', () => {
        if (!isAppOnline) {
          toast({
            status: 'info',
            description: 'The connectivity is back, sync in progress...',
          })
          isAppOnline = true
        }
      })

      window.addEventListener('offline', () => {
        toast({
          status: 'warning',
          description:
            'The app is running offline, any changes mades during this time will be synced as soon as the connectivity is back',
        })
        isAppOnline = false
      })

      if (process.env.NODE_ENV === 'development') {
        checkValidServiceWorker(swUrl)
      } else {
        registerValidSW(swUrl)
      }
    })
  }
}

function registerValidSW(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing as ServiceWorker
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              toast({
                status: 'info',
                description: '🔄 New content is available; please refresh.',
              })
            } else {
              toast({
                status: 'info',
                description: '🚀 Content is cached for offline use.',
              })
            }
          }
        }
      }
    })
    .catch((error) => {
      toast({
        status: 'error',
        description:
          'Error during service worker registration: ' + error.message,
      })
    })
}

function checkValidServiceWorker(swUrl: string) {
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        response.headers.get('content-type')!.indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        registerValidSW(swUrl)
      }
    })
    .catch(() => {
      toast({
        status: 'warning',
        description:
          'No internet connection found. App is running in offline mode.',
      })
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister()
    })
  }
}
