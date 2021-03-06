import { IncomingHttpHeaders } from 'http'
import { AppContext, AppProps } from 'next/app'
import React from 'react'
import initAuth from '../lib/initAuth'
import ChakraProvider from '../providers/Chakra'
import { UserAgentProvider } from '../providers/UserAgentProvider'

initAuth()
interface Props extends AppProps {
  cookies: string
  userAgent: IncomingHttpHeaders['user-agent']
}

function App({ Component, pageProps, cookies, userAgent }: Props) {
  return (
    <UserAgentProvider userAgent={userAgent}>
      <ChakraProvider cookies={cookies}>
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
