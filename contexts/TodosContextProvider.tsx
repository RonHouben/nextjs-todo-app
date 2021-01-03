import {
  Context,
  createContext,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { ITodo } from "../interfaces/todos";

export interface ITodosContext {
  todos?: ITodo[];
  setTodos: React.Dispatch<SetStateAction<ITodo[] | undefined>>;
}

export const TodosContext = createContext<Partial<ITodosContext>>(
  {}
) as Context<ITodosContext>;

interface ITodosContextProvider {
  children: ReactNode;
}

export const TodosContextProvider = ({ children }: ITodosContextProvider) => {
  const [todos, setTodos] = useState<ITodo[]>();

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
