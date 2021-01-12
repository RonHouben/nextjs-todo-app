import { GetServerSideProps } from 'next'
import { signIn, signOut, getSession, Session } from 'next-auth/client'
import Layout from '../components/Layout'
import Paper from '../components/Paper'

interface InitialProps {
  session?: Session | null
}

export default function LoginPage({ session }: InitialProps = {}) {
  return (
    <Layout pageTitle='Login'>
      <Paper shadow rounded>
        {!session && (
          <div>
            <h1>Not signed in!</h1>
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className='bg-purple-300'
            >
              sign in with Github
            </button>
          </div>
        )}
        {session && (
          <div>
            <h1>Hi {session.user.name}</h1>
            <pre>{JSON.stringify(session.user, null, '  ')}</pre>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className='bg-purple-300'
            >
              sign Out
            </button>
          </div>
        )}
      </Paper>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async ({
  req,
}) => {
  const session = await getSession({ req })

  return {
    props: {
      session,
    },
  }
}
