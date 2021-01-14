import { AppProps } from "next/app";
import "../styles/global.css";
import { ThemeProvider } from "next-themes";
import { Provider as AuthProvider } from "next-auth/client";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="light"
    >
      <AuthProvider session={pageProps.sessions}>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
