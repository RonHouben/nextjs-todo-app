import { AppProps } from "next/app";
import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import { FirebaseAppProvider } from "reactfire";
import { firebaseApp } from "../lib/firebaseClient";
import { Provider as AuthProvider } from "next-auth/client";
import { Flip, ToastContainer } from "react-toastify";

type TToastContextClass = {
  [key: string]: string;
};
const toastContextClass: TToastContextClass = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-yellow-500",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      themes={["light", "dark"]}
      defaultTheme="light"
    >
      <AuthProvider session={pageProps.sessions}>
        <FirebaseAppProvider firebaseApp={firebaseApp}>
          <ToastContainer
            transition={Flip}
            toastClassName={(toast) =>
              toastContextClass[toast?.type || "default"] +
              " flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
            }
            bodyClassName={() => "text-sm font-white font-med block p-3"}
          />
          <Component {...pageProps} />
        </FirebaseAppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
