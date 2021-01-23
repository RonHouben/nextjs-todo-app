import { AppProps } from "next/app";
import "../styles/global.css";
import { ThemeProvider } from "next-themes";
import { FirebaseAppProvider } from "reactfire";
import { firebaseApp } from "../lib/firebaseClient";
import { Provider as AuthProvider } from "next-auth/client";

function App({ Component, pageProps }: AppProps) {
  console.log("process", process.env.NODE_ENV);
  return (
    <ThemeProvider
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="light"
    >
      <AuthProvider session={pageProps.sessions}>
        <FirebaseAppProvider firebaseApp={firebaseApp}>
          <Component {...pageProps} />
        </FirebaseAppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
