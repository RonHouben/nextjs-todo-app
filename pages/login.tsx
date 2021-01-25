import Layout from "../components/Layout";
import Paper from "../components/Paper";
import Textbox from "../components/Textbox";
import { getSession, signIn } from "next-auth/client";
import GithubIconButton from "../components/IconButton";
import GoogleIconButton from "../components/IconButton";
import { GetServerSideProps } from "next";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { theme } = useTheme();
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
        <div className="flex">
          <GithubIconButton
            alt="Sign In with GitHub"
            src={
              theme === "light"
                ? "/icons/github-icon-dark.png"
                : "/icons/github-icon-light.png"
            }
            size="lg"
            // className="bg-light-background"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          />
          <GoogleIconButton
            alt="Sign in with Google"
            src="/icons/google-icon.png"
            size="lg"
            // className="bg-light-background"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          />
        </div>
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
