import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAuthUser } from 'next-firebase-auth'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import ThemeSwitcherButton from './ThemeSwitcherButton'

interface Props {
  pageTitle?: string
}

export default function Navbar({ pageTitle }: Props) {
  const { firebaseUser } = useAuthUser()
  const router = useRouter()
  const avatarBorderColor = useColorModeValue(
    'secondary.light',
    'secondary.dark'
  )

  return (
    <Container>
      <Flex h="40" justifyContent="space-between" alignItems="center" pb="10">
        <Popover trigger="hover" placement="right-start">
          <PopoverTrigger>
            <Button variant="unstyled" onClick={() => router.push('/profile')}>
              <Avatar
                size="md"
                name={firebaseUser?.displayName || undefined}
                loading="eager"
                showBorder
                cursor="pointer"
                borderColor={avatarBorderColor}
                src={firebaseUser?.photoURL || undefined}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent width="2xs">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Hi, {firebaseUser?.displayName}!</PopoverHeader>
            <PopoverBody>
              <Link as={NextLink} href="/profile">
                Profile
              </Link>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Heading as="h1">{pageTitle || null}</Heading>
        <ThemeSwitcherButton />
      </Flex>
    </Container>
  )
}
