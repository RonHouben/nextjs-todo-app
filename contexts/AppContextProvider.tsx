import { createContext, ReactNode, SetStateAction, useState } from "react";

interface IAppContext {
  darkMode: boolean;
  setDarkMode: React.Dispatch<SetStateAction<boolean>>;
}

interface IAppContextProvider {
  children: ReactNode;
}

const AppContext = createContext<Partial<IAppContext>>(
  {}
) as React.Context<IAppContext>;

const AppContextProvider = ({ children }: IAppContextProvider) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
export type { IAppContext };
