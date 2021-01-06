import { AppProps } from 'next/app'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import '../styles/global.css'

function TodoApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute='class'
      themes={['light', 'dark']}
      defaultTheme='light'
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default TodoApp
