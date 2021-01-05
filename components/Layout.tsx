import React, { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import { useTheme } from 'next-themes'

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
        <title>{pageTitle}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
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
