import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import Textbox from '../components/Textbox'
import GithubIconButton from '../components/IconButton'
import GoogleIconButton from '../components/IconButton'
import { useTheme } from 'next-themes'
import LoadingScreen from '../components/LoadingScreen'
import { toast } from 'react-toastify'

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
      .then((result) => console.log(result))
      .catch((error) => toast.error(error.message))
  }, [])

  // handlers
  interface LoginProps {
    provider: 'email-password' | 'github' | 'google'
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
    if (provider === 'github') {
      firebase.auth().signInWithRedirect(new firebase.auth.GithubAuthProvider())
      return
    }
    if (provider === 'google') {
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      return
    }
  }

  // render component
  return (
    <Layout>
      <Paper
        centerContent
        shadow
        rounded
        className="w-full p-4 prose dark:prose-dark lg:prose-lg space-y-5 px-10"
      >
        <h2 className="">Log In</h2>
        <Textbox
          disabled
          value={email}
          onChange={setEmail}
          placeholder="Email address"
          type="email"
          border
        />
        <Textbox
          disabled
          value={password}
          onChange={setPassword}
          placeholder="Password"
          type="password"
          border
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
            onClick={() => handleLogin({ provider: 'github' })}
          />
          <GoogleIconButton
            alt="Sign in with Google"
            src="/icons/google-icon.png"
            size="lg"
            onClick={() => handleLogin({ provider: 'google' })}
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
