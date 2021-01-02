import { NextPageContext } from "next";
import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import Todo from "../components/Todo";
import { ITodosContext, TodosContext } from "../contexts/TodosContextProvider";
import { ITodo } from "../interfaces/todos";
import { getTodos } from "./api/todos/index";

interface Props {
  initialTodos: ITodo[];
  error?: {
    message: string;
  };
}
export default function Home({ initialTodos, error }: Props) {
  const { todos, setTodos } = useContext<ITodosContext>(TodosContext);
  // TODO: CHANGE TO useSWR hook!

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  if (error) return <div>ERROR! {error.message}</div>;

  return (
    <Layout pageTitle="TODO">
      <div className="flex flex-col justify-start items-center space-y-7 w-full">
        <Todo createNewTodo autoFocus placeholder="Create a new todo..." />
        <div className="w-full h-full rounded-md">
          {todos && todos.map((todo, i) => <Todo key={i} todoData={todo} />)}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(_context: NextPageContext) {
  try {
    // get todos from database
    const initialTodos = await getTodos();

    return {
      props: {
        initialTodos,
      } as Props,
    };
  } catch (error) {
    return {
      props: {
        error: {
          message: error.message,
        },
      } as Props,
    };
  }
}
