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
import React, { Fragment, ReactNode } from 'react'
import { useUserAgent } from '../hooks/useUserAgent'
import tailwindConfig from '../tailwind.config'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  pageTitle?: string
}

export default function Layout({ children, pageTitle }: Props) {
  const { theme } = useTheme()
  const bgColor = useColorModeValue('primary.light', 'primary.dark')

  return (
    <Fragment>
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
    </Fragment>
  )
}

const Planets = () => {
  return (
    <Fragment>
      <Circle
        w="10%"
        top="50%"
        left="15%"
        bgColor="orange.400"
        border="0.3em solid rgba(160, 147, 130, 0.7)"
      >
        <Circle
          w="15%"
          top="50%"
          left="5%"
          bgColor="red.700"
          border="0.3em solid rgba(160, 147, 130, 0.7)"
        />
      </Circle>
      <Circle
        w="xs"
        top="14%"
        right="15%"
        bgColor="yellow.500"
        border="0.3em solid rgba(160, 147, 130, 0.7)"
      />
    </Fragment>
  )
}

interface CircleProps {
  w: LayoutProps['w']
  top?: PositionProps['top']
  bottom?: PositionProps['bottom']
  left?: PositionProps['left']
  right?: PositionProps['right']
  bgColor?: BackgroundProps['bgClip']
  border?: string
  filter?: string
  children?: ReactNode
}

const Circle = ({
  w,
  top,
  bottom,
  left,
  right,
  bgColor,
  filter,
  border,
  children,
}: CircleProps) => {
  const { isFirefox } = useUserAgent()

  return (
    <Box
      display="flex"
      border={border}
      style={{
        backdropFilter: !isFirefox ? filter : undefined,
        WebkitBackdropFilter: !isFirefox ? filter : undefined,
      }}
      w={w}
      _after={{
        content: '""',
        display: 'block',
        paddingBottom: '100%',
      }}
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      bgColor={isFirefox || !filter ? bgColor : undefined}
      rounded="full"
      position="absolute"
    >
      {children}
    </Box>
  )
}
