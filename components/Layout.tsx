import { useTheme } from 'next-themes'
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import tailwindConfig from '../tailwind.config'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  pageTitle?: string
}

export default function Layout({ children, pageTitle }: Props) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true))

  if (!mounted) return null

  return (
    <div className={`h-screen w-screen`}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Some description" />
        <meta name="keywords" content="some keywords here" />

        <title>{pageTitle}</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        <meta name="theme" content={theme} />
        <meta
          name="theme-color"
          content={
            theme === 'light'
              ? tailwindConfig.theme.extend.colors.light.background
              : tailwindConfig.theme.extend.colors.dark.background
          }
        />
      </Head>
      {/* TOP BACKGROUND */}
      <div
        className={`h-1/3 bg-no-repeat bg-cover ${
          theme === 'dark'
            ? 'bg-mobile-dark sm:bg-desktop-dark'
            : 'bg-mobile-light sm:bg-desktop-light'
        }`}
      >
        {/* CONTENT */}
        <div className="relative container mx-auto w-screen h-2/3 md:w-1/2 bg-transparent">
          <div className="absolute top-10 w-full bg-transparent">
            <Navbar pageTitle={pageTitle} />
            <div className="flex flex-col justify-start items-center space-y-7 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
