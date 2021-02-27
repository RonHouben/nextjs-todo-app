import { ThemeProvider } from 'next-themes'
import { AppProps } from 'next/app'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import initAuth from '../lib/initAuth'
import '../styles/global.css'

type TToastContextClass = {
  [key: string]: string
}
const toastContextClass: TToastContextClass = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-500',
  default: 'bg-indigo-600',
  dark: 'bg-white-600 font-gray-300',
}

initAuth()

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      themes={['light', 'dark']}
      defaultTheme="light"
    >
      <ToastContainer
        transition={Flip}
        toastClassName={(toast) =>
          toastContextClass[toast?.type || 'default'] +
          ' flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
        }
        bodyClassName={() => 'text-sm font-white font-med block p-3'}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App
