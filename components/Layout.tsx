import {
  BackgroundProps,
  Box,
  Container,
  LayoutProps,
  PositionProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import Head from 'next/head'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import tailwindConfig from '../tailwind.config'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  pageTitle?: string
}

export default function Layout({ children, pageTitle }: Props) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const bgColor = useColorModeValue('primary.light', 'primary.dark')

  useEffect(() => setMounted(true))

  if (!mounted) return null

  return (
    <>
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
      <Box
        display="flex"
        flexDir="column"
        bgColor={bgColor}
        minH="100vh"
        h="full"
        position="relative"
      >
        <Planets />
        <Navbar pageTitle={pageTitle} />
        <Container maxW="container.sm">{children}</Container>
      </Box>
    </>
  )
}

const Planets = () => (
  <Fragment>
    <Circle h="xs" w="xs" top="50%" left="15%" bgColor="gray.400">
      <Circle
        h="2rem"
        w="2rem"
        top="50%"
        left="5%"
        filter="brightness(.5) blur(2px)"
      />
    </Circle>
    <Circle h="xs" w="xs" top="14%" right="15%" filter="brightness(2)" />
  </Fragment>
)

interface CircleProps {
  h: LayoutProps['h']
  w: LayoutProps['w']
  top?: PositionProps['top']
  bottom?: PositionProps['bottom']
  left?: PositionProps['left']
  right?: PositionProps['right']
  bgColor?: BackgroundProps['bgClip']
  filter?: string
  children?: ReactNode
}

const Circle = ({
  h,
  w,
  top,
  bottom,
  left,
  right,
  bgColor,
  filter,
  children,
}: CircleProps) => (
  <Box
    display="flex"
    style={{
      backdropFilter: filter,
      WebkitBackdropFilter: filter,
      border: '0.3em solid rgba(160, 147, 130, 0.7)',
    }}
    h={h}
    w={w}
    top={top}
    bottom={bottom}
    left={left}
    right={right}
    bgColor={!filter ? bgColor : undefined}
    rounded="full"
    position="absolute"
  >
    {children}
  </Box>
)
