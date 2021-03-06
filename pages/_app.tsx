import { AppContext, AppProps } from 'next/app'
import { IncomingHttpHeaders } from 'node:http'
import React from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import initAuth from '../lib/initAuth'
import ChakraProvider from '../providers/Chakra'
import { UserAgentProvider } from '../providers/UserAgentProvider'
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

interface Props extends AppProps {
  cookies: string
  userAgent: IncomingHttpHeaders['user-agent']
}

function App({ Component, pageProps, cookies, userAgent }: Props) {
  return (
    <UserAgentProvider userAgent={userAgent}>
      <ChakraProvider cookies={cookies}>
        <ToastContainer
          transition={Flip}
          toastClassName={(toast) =>
            toastContextClass[toast?.type || 'default'] +
            ' flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
          }
          bodyClassName={() => 'text-sm font-white font-med block p-3'}
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </UserAgentProvider>
  )
}

// SSR to get the client browser. This can later be used to apply styling for a specific browser
App.getInitialProps = async (app: AppContext) => {
  return { userAgent: app.ctx.req?.headers['user-agent'] }
}

export default App
