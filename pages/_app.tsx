import { AppProps } from "next/app";
import React from "react";
import { AppContextProvider } from "../contexts/AppContextProvider";
import { TodosContextProvider } from "../contexts/TodosContextProvider";
import { ThemeProvider } from "next-themes";
import "../styles/global.css";

function TodoApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <ThemeProvider
        attribute="class"
        themes={["light", "dark"]}
        defaultTheme="light"
      >
        <TodosContextProvider>
          <Component {...pageProps} />
        </TodosContextProvider>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default TodoApp;
