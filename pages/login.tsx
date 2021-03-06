import {
  Button,
  Heading,
  HStack,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import firebase from 'firebase/app'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import React, { useEffect, useState } from 'react'
import { FaGithub as GithubIcon, FaGoogle as GoogleIcon } from 'react-icons/fa'
import IconButton from '../components/IconButton'
import Layout from '../components/Layout'
import LoadingScreen from '../components/LoadingScreen'
import Paper from '../components/Paper'
import Textbox from '../components/Textbox'
import { ProviderId } from '../utils/interfaces/user'

function LoginPage() {
  const formFieldsColor = useColorModeValue('secondary.light', 'secondary.dark')
  const toast = useToast({ position: 'top-right' })

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // set firebase analytics current screen
  useEffect(() => {
    firebase.analytics().setCurrentScreen('login_screen')
  }, [])

  // handle login redirect result
  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .catch((error) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          if (error.credential.providerId === 'github.com') {
            // TODO:
            //  - get existing user out of the DB by e-mail address to check which provider they have; => security issue
            //  - tell user what the existing provider is and give them the choice to:
            //    1. login & link the Github account automatically;
            //    2. login with existing provider (so they can later link another provider in the profile page);
            //    3. cancel the login;
            toast({ description: error.message, status: 'error', duration: 0 })
            return
          }
        }
        console.error(error)
        toast({ description: error.message, status: 'error', duration: 0 })
      })
  }, [])

  // handlers
  interface LoginProps {
    provider: ProviderId
    email?: string
    password?: string
  }

  const handleLogin = async ({ provider, email, password }: LoginProps) => {
    // log analytics event
    firebase.analytics().logEvent('login', { provider, email })
    // call signIn function
    if (provider === 'email-password' && email && password) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          toast({ status: 'error', title: 'Wrong password!' })
        } else {
          toast({ status: 'error', description: error.message })
        }
      }

      return
    }
    if (provider === 'github.com') {
      firebase.auth().signInWithRedirect(new firebase.auth.GithubAuthProvider())
      return
    }
    if (provider === 'google.com') {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      return
    }
  }

  // render component
  return (
    <Layout>
      <Paper centerContent shadow rounded padding="6">
        <Heading size="md" mb="6">
          Log In
        </Heading>
        <VStack spacing="2">
          <Textbox
            disabled
            value={email}
            onChange={setEmail}
            placeholder="Email address"
            type="email"
          />
          <Textbox
            disabled
            value={password}
            onChange={setPassword}
            placeholder="Password"
            type="password"
          />
          <Button
            disabled
            variant="outline"
            width="full"
            borderColor={formFieldsColor}
            _focus={{
              outline: 'none',
              borderColor: formFieldsColor,
            }}
            onClick={() =>
              handleLogin({ provider: 'email-password', email, password })
            }
          >
            Log in
          </Button>
        </VStack>
        <HStack mt="5" spacing="4">
          <IconButton
            title="Login with Github"
            ariaLabel="Login with Github"
            as={GithubIcon}
            onClick={() => handleLogin({ provider: 'github.com' })}
          />
          <IconButton
            title="Login with Google"
            ariaLabel="Login with Google"
            as={GoogleIcon}
            onClick={() => handleLogin({ provider: 'google.com' })}
          />
        </HStack>
      </Paper>
    </Layout>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: LoadingScreen,
})(LoginPage)
