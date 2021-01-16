import { GetServerSideProps } from 'next'
import { signIn, signOut, getSession, Session } from 'next-auth/client'
import GithubIconButton from '../components/IconButton'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import Textbox from '../components/Textbox'

interface InitialProps {
  session?: Session | null
}

export default function LoginPage({ session }: InitialProps = {}) {
  return (
    <Layout>
      <Paper
        centerContent
        shadow
        rounded
        className='w-full opacity-70 p-4 prose dark:prose-dark lg:prose-lg space-y-5 px-10'
      >
        <h2 className=''>Log In</h2>
        <Textbox
          // disabled
          value=''
          placeholder='Email address'
          type='email'
          border
        />
        <Textbox
          // disabled
          value=''
          placeholder='Password'
          type='password'
          border
        />
        <button className='w-full p-2 border-2 rounded-lg'>Log in</button>
        <GithubIconButton
          src='/icons/GitHub-Mark-Light-120px-plus.png'
          className='bg-blue-400 hover:bg-green-300'
          onClick={() => signIn('github', { callbackUrl: '/' })}
        ></GithubIconButton>
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
