import Layout from "../components/Layout";
import Paper from "../components/Paper";
import Textbox from "../components/Textbox";
import { getSession, signIn } from "next-auth/client";
import GithubIconButton from "../components/IconButton";
import GoogleIconButton from "../components/IconButton";
import { GetServerSideProps } from "next";

export default function LoginPage() {
  // handlers
  const handleSignIn = async (provider: string) => {
    try {
      // signIn with Github
      switch (provider) {
        case "github":
          signIn("github", { callbackUrl: "/" });
          return;
        case "google":
          signIn("google", { callbackUrl: "/" });
          return;
        default:
          return;
      }
    } catch (error) {
      console.error("[/login:handleSignIn()]", error);
      return;
    }
  };

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
        <GithubIconButton
          alt="Sign In with GitHub"
          src="/icons/GitHub-Mark-Light-120px-plus.png"
          className="bg-blue-400 hover:bg-green-300"
          onClick={() => handleSignIn("github")}
        />
        <GoogleIconButton
          alt="Sign in with Google"
          src="/icons/google-icon.png"
          onClick={() => handleSignIn("google")}
        />
      </Paper>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
  return { props: {} };
};
