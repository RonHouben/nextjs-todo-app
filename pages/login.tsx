import { GetServerSideProps } from "next";
import { signIn, signOut, getSession, Session } from "next-auth/client";
import Layout from "../components/Layout";
import Paper from "../components/Paper";
import Textbox from "../components/Textbox";

interface InitialProps {
  session?: Session | null;
}

export default function LoginPage({ session }: InitialProps = {}) {
  return (
    <Layout>
      <Paper shadow rounded className="">
        <div className="p-4 prose dark:prose-dark text-center">
          <h2>Login</h2>
          <form action="" className="space-x-3">
            <Textbox placeholder="email" />
            <input id="email" type="email" placeholder="Email address" />
          </form>
        </div>
      </Paper>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async ({
  req,
}) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};
