import { AppProps } from 'next/app'
import React from 'react'
import initAuth from '../lib/initAuth'
import ChakraProvider from '../providers/Chakra'

initAuth()
interface Props extends AppProps {
  cookies: string
}

function App({ Component, pageProps, cookies }: Props) {
  return (
    <ChakraProvider cookies={cookies}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
