import {
  BackgroundProps,
  BorderProps,
  Box,
  Container,
  LayoutProps,
  PositionProps,
  useColorModePreference,
  useColorModeValue,
} from '@chakra-ui/react'
import Head from 'next/head'
import React, { Fragment, ReactNode } from 'react'
import { useUserAgent } from '../hooks/useUserAgent'
import Navbar from './Navbar'

type Props = {
  children?: ReactNode
  pageTitle?: string
}

export default function Layout({ children, pageTitle }: Props) {
  const theme = useColorModePreference()
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
        <meta name="theme-color" content={bgColor} />
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
        borderWidth="0.3rem"
        borderColor="orange.300"
        borderStyle="double"
      >
        <Circle
          w="15%"
          top="50%"
          left="5%"
          bgColor="orange.600"
          borderColor="orange.500"
          borderWidth=".15rem"
        />
        <Circle w="5%" bottom="50%" left="15%" bgColor="orange.600" />
      </Circle>
      <Circle
        w="xs"
        top="14%"
        right="15%"
        bgColor="orange.500"
        borderWidth="0.5rem"
        borderColor="orange.300"
        borderStyle="double"
      >
        <Circle
          w="10%"
          top="25%"
          right="25%"
          bgColor="orange.900"
          borderColor="purple.800"
          borderWidth="1px"
        />
      </Circle>
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
  borderWidth?: BorderProps['borderWidth']
  borderColor?: BorderProps['borderColor']
  borderStyle?: BorderProps['borderStyle']
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
  borderWidth,
  borderColor,
  borderStyle,
  children,
}: CircleProps) => {
  const { isFirefox } = useUserAgent()

  return (
    <Box
      display="flex"
      borderWidth={borderWidth}
      borderColor={borderColor}
      borderStyle={borderStyle || 'solid'}
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
