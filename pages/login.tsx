import { GetServerSideProps } from 'next'
import { signIn, signOut, getSession, Session } from 'next-auth/client'
import Layout from '../components/Layout'
import Paper from '../components/Paper'

interface InitialProps {
  session?: Session | null
}

export default function LoginPage({ session }: InitialProps = {}) {
  return (
    <Layout>
      <Paper shadow rounded className='p-4'>
        <article className='prose prose-green'>
          <h1>Garlic bread with cheese: What the science tells us</h1>
          <p>
            For years parents have espoused the health benefits of eating garlic
            bread with cheese to their children, with the food earning such an
            iconic status in our culture that kids will often dress up as warm,
            cheesy loaf for Halloween.
          </p>
          <p>
            But a recent study shows that the celebrated appetizer may be linked
            to a series of rabies cases
          </p>
        </article>
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
