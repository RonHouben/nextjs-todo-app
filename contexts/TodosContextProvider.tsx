import { createContext, ReactNode, SetStateAction, useState } from "react";
import { ITodo } from "../interfaces/todos";

export interface ITodosContext {
  todos?: ITodo[];
  setTodos: React.Dispatch<SetStateAction<ITodo[]>>;
}

interface ITodosContextProvider {
  children: ReactNode;
}

export const TodosContext = createContext<Partial<ITodosContext>>(
  {}
) as React.Context<ITodosContext>;

export const TodosContextProvider = ({ children }: ITodosContextProvider) => {
  const [todos, setTodos] = useState<ITodo[]>([]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
