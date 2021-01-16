import { signout, useSession } from 'next-auth/client'
import ProfileIconButton from './IconButton'
import ThemeSwitcherButton from './ThemeSwitcherButton'

interface Props {
  pageTitle?: string
}

export default function Navbar({ pageTitle }: Props) {
  const session = useSession()
  const profilePicture = session[0]?.user.image

  return (
    <div className='flex justify-between items-center pb-10'>
      {session && (
        <ProfileIconButton
          src={profilePicture || '/icons/unknown-user-icon.png'}
          size='2xl'
          onClick={signout}
          focusable
          className={!profilePicture ? 'bg-purple-200 ' : ''}
        />
      )}
      <h1 className='uppercase'>{pageTitle || null}</h1>
      <ThemeSwitcherButton />
    </div>
  )
}
