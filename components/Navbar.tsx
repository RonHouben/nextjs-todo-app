import { useAuthUser } from 'next-firebase-auth'
import ProfileIconButton from './IconButton'
import ThemeSwitcherButton from './ThemeSwitcherButton'

interface Props {
  pageTitle?: string
}

export default function Navbar({ pageTitle }: Props) {
  const { firebaseUser } = useAuthUser()

  return (
    <div className="flex justify-between items-center pb-10">
      <ProfileIconButton
        alt="Go to Profile"
        src={firebaseUser?.photoURL || '/icons/unknown-user-icon.png'}
        size="2xl"
        href="/profile"
        focusable
        className={firebaseUser ? 'visible' : 'hidden'}
      />
      <h1 className="uppercase">{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  )
}
