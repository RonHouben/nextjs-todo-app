import { AppProps } from "next/app";
import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { FirebaseAppProvider } from "reactfire";
import { firebaseApp } from "../lib/firebaseClient";
import { Provider as AuthProvider } from "next-auth/client";
import { Flip, ToastContainer } from "react-toastify";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="light"
    >
      <AuthProvider session={pageProps.sessions}>
        <FirebaseAppProvider firebaseApp={firebaseApp}>
          <ToastContainer transition={Flip} />
          <Component {...pageProps} />
        </FirebaseAppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
