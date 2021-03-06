import { Flex, Heading, Stack, Text } from '@chakra-ui/react'
import firebase from 'firebase/app'
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserSSR,
} from 'next-firebase-auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiChevronLeftCircle as BackIcon } from 'react-icons/bi'
import { RiLogoutCircleRLine as LogoutIcon } from 'react-icons/ri'
import { toast } from 'react-toastify'
import IconButton from '../components/IconButton'
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
  // const iconColor = useColorModeValue('secondary.light', 'secondary.dark')

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

  const handleSwitchProvider = (providerId: ProviderId) => {
    const linked: boolean = linkedProviders.some((p) => p === providerId)

    return linked
      ? handleUnlinkProvider(providerId)
      : handleLinkProvider(providerId)
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
      <Paper rounded shadow padding="6">
        <Flex justifyContent="space-between" alignItems="center" mb="6">
          <IconButton
            as={BackIcon}
            title="Go Back"
            ariaLabel="Go Back"
            size="md"
            onClick={handleBackButtonClick}
          />
          <Heading size="md">Profile</Heading>
          <IconButton
            as={LogoutIcon}
            title="Logout"
            ariaLabel="Logout"
            size="md"
            onClick={handleSignOut}
          />
        </Flex>
        <main>
          <section>
            <Stack direction="row" wrap="wrap" spacing="6">
              <Text fontSize="md">Social Login Providers:</Text>
              <ProviderList
                onSwitchProvider={handleSwitchProvider}
                linkedProviders={linkedProviders}
                direction="column"
              />
            </Stack>
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
