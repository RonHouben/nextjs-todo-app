import { useEffect } from 'react'
import firebase from 'firebase/app'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import Textbox from '../components/Textbox'
import GithubIconButton from '../components/IconButton'
import GoogleIconButton from '../components/IconButton'
import { useTheme } from 'next-themes'
import LoadingScreen from '../components/LoadingScreen'

function LoginPage() {
  const { theme } = useTheme()

  useEffect(() => {
    firebase.analytics().setCurrentScreen('login_screen')
  }, [])

  // handlers
  const handleLogin = (provider: 'github' | 'google') => {
    // log analytics event
    firebase.analytics().logEvent('login', { provider })
    // call signIn function
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
          // disabled
          value=""
          placeholder="Email address"
          type="email"
          border
        />
        <Textbox
          // disabled
          value=""
          placeholder="Password"
          type="password"
          border
        />
        <button className="w-full p-2 border-2 rounded-lg">Log in</button>
        <div className="flex">
          <GithubIconButton
            alt="Sign In with GitHub"
            src={
              theme === 'light'
                ? '/icons/github-icon-dark.png'
                : '/icons/github-icon-light.png'
            }
            size="lg"
            onClick={() => handleLogin('github')}
          />
          <GoogleIconButton
            alt="Sign in with Google"
            src="/icons/google-icon.png"
            size="lg"
            onClick={() => handleLogin('google')}
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
