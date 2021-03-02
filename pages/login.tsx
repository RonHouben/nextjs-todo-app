import firebase from 'firebase/app'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  default as GithubIconButton,
  default as GoogleIconButton,
} from '../components/IconButton'
import Layout from '../components/Layout'
import LoadingScreen from '../components/LoadingScreen'
import Paper from '../components/Paper'
import Textbox from '../components/Textbox'
import { ProviderId } from '../utils/interfaces/user'

function LoginPage() {
  const { theme } = useTheme()

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
            toast.error(error.message, { autoClose: false })
            return
          }
        }
        console.error(error)
        toast.error(error.message)
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
          toast.error('Wrong password.')
        } else {
          toast.error(error.message)
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
      <Paper centerContent shadow rounded>
        <h2 className="">Log In</h2>
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
        <button
          disabled
          className="w-full p-2 border-2 rounded-lg"
          onClick={() =>
            handleLogin({ provider: 'email-password', email, password })
          }
        >
          Log in
        </button>
        <div className="flex">
          <GithubIconButton
            alt="Sign In with GitHub"
            src={
              theme === 'light'
                ? '/icons/github-icon-dark.png'
                : '/icons/github-icon-light.png'
            }
            size="lg"
            onClick={() => handleLogin({ provider: 'github.com' })}
          />
          <GoogleIconButton
            alt="Sign in with Google"
            src="/icons/google-icon.png"
            size="lg"
            onClick={() => handleLogin({ provider: 'google.com' })}
          />
        </div>
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
