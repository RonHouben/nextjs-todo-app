import firebase from 'firebase/app'
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BackIconButton from '../components/IconButton'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import ProviderList from '../components/ProviderList'
import firebaseAdmin from '../lib/firebaseAdmin'
import { IUser, IUserProfileData, ProviderId } from '../utils/interfaces/user'

interface Props {
  userProfileData: Stringified<IUserProfileData>
}

function Profile({ userProfileData }: Props) {
  const user = JSON.parse(userProfileData)
  const router = useRouter()
  const { signOut, firebaseUser } = useAuthUser()

  const [linkedProviders, setLinkedProviders] = useState<
    IUserProfileData['providerIds']
  >(user.providerIds)

  // set firebase analytics current scren
  useEffect(() => {
    firebase.analytics().setCurrentScreen('profile_page')
  }, [])

  // handlers
  const handleBackButtonClick = () => {
    // log analytics event
    firebase
      .analytics()
      .logEvent('navigate_back', { from: '/profile', to: router.query })
    // route back
    router.back()
  }

  const handleSignOut = async () => {
    // log analytics event
    firebase.analytics().logEvent('logout')
    // sign the user out
    signOut()
    // route to login page
    router.push('/login')
  }

  const handleUnlinkProvider = async (providerId: ProviderId) => {
    if (firebaseUser) {
      try {
        firebase.analytics().logEvent('unlink_account_provider', { providerId })

        await firebaseUser.unlink(providerId)

        setLinkedProviders((prev) => prev.filter((p) => p !== providerId))

        toast.success(`Unlinked ${providerId}`)
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleLinkProvider = async (providerId: ProviderId) => {
    const getProvider = (
      id: ProviderId
    ): firebase.auth.AuthProvider | undefined => {
      switch (id) {
        case 'github.com':
          return new firebase.auth.GithubAuthProvider()
        case 'google.com':
          return new firebase.auth.GoogleAuthProvider()
      }
    }

    const provider = getProvider(providerId)

    if (provider) {
      try {
        await firebaseUser?.linkWithPopup(provider)
        toast.success(`Linked ${providerId}`)
        setLinkedProviders((prev) => [...prev, providerId])
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <Layout>
      <Paper rounded shadow className="w-full px-5">
        <header className="flex items-center justify-between">
          <BackIconButton
            src="/icons/back-arrow.svg"
            alt="Go Back"
            size="xl"
            onClick={handleBackButtonClick}
          />
          <h1 className="m-1">Hi {user.name}!</h1>
          <button
            onClick={handleSignOut}
            className="border-2 border-black m-1 p-1 rounded-sm"
          >
            Sign Out
          </button>
        </header>
        <main>
          <section>
            {linkedProviders.length > 0 && (
              <div className="flex flex-wrap gap-5 items-center">
                <div>Linked providers:</div>
                <ProviderList
                  onClick={handleUnlinkProvider}
                  providers={linkedProviders}
                />
              </div>
            )}
          </section>
          <section>
            <div className="flex flex-wrap gap-5 items-start">
              <div>Link more providers:</div>
              <ProviderList
                filterOut={linkedProviders}
                onClick={handleLinkProvider}
              />
            </div>
          </section>
        </main>
      </Paper>
    </Layout>
  )
}

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  const { id: uid } = AuthUser

  if (!uid) {
    return {
      redirect: '/login',
      props: {},
    }
  }
  const { providerData } = await firebaseAdmin().auth.getUser(uid)

  const snapshot = await firebaseAdmin()
    .firestore.collection('users')
    .doc(uid)
    .get()

  const userProfileData: IUserProfileData = {
    ...(snapshot.data() as IUser),
    providerIds: providerData.map((v) => v.providerId) as ProviderId[],
  }

  return {
    props: {
      userProfileData: JSON.stringify(userProfileData),
    },
  }
})

export default withAuthUser<Props>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile)
