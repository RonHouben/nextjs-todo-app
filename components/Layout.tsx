import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import { useTheme } from 'next-themes'
import tailwindConfig from '../tailwind.config'

type Props = {
  children?: ReactNode
  pageTitle?: string
}

export default function Layout({ children, pageTitle = 'Todo App' }: Props) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => setMounted(true))

  if (!mounted) return null

  return (
    <div className={`h-screen w-screen text-body font-josefin-sans`}>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content='Some description' />
        <meta name='keywords' content='some keywords here' />

        <title>{pageTitle}</title>

        <link rel='manifest' href='/manifest.json' />
        <link
          href='/icons/favicon-16x16.png'
          rel='icon'
          type='image/png'
          sizes='16x16'
        />
        <link
          href='/icons/favicon-32x32.png'
          rel='icon'
          type='image/png'
          sizes='32x32'
        />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon.png' />

        <meta name='theme' content={theme} />
        <meta
          name='theme-color'
          content={
            theme === 'light'
              ? tailwindConfig.theme.extend.colors.light.background
              : tailwindConfig.theme.extend.colors.dark.background
          }
        />
      </Head>
      {/* TOP BACKGROUND */}
      <div
        className={`h-2/3 bg-no-repeat bg-contain ${
          theme === 'dark'
            ? 'bg-mobile-dark sm:bg-desktop-dark'
            : 'bg-mobile-light sm:bg-desktop-light'
        }`}
      >
        {/* CONTENT */}
        <div className='relative container mx-auto w-screen md:w-1/2 bg-transparent'>
          <div className='absolute top-16 w-full bg-transparent space-y-10'>
            <Navbar pageTitle={pageTitle} />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
