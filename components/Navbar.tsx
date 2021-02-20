import { useRouter } from 'next/router'
import { useAuthUser } from 'next-firebase-auth'
import firebase from 'firebase/app'
import ProfileIconButton from './IconButton'
import ThemeSwitcherButton from './ThemeSwitcherButton'

interface Props {
  pageTitle?: string
}

export default function Navbar({ pageTitle }: Props) {
  const { firebaseUser, signOut } = useAuthUser()
  const router = useRouter()

  const handleLogout = async () => {
    // log analytics event
    firebase.analytics().logEvent('logout')
    // sign the user out
    signOut()
    // route to login page
    router.push('/login')
  }

  return (
    <div className="flex justify-between items-center pb-10">
      <ProfileIconButton
        alt="Go to Profile"
        src={firebaseUser?.photoURL || '/icons/unknown-user-icon.png'}
        size="2xl"
        onClick={handleLogout}
        focusable
        className={firebaseUser ? 'visible' : 'hidden'}
      />
      <h1 className="uppercase">{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  )
}
