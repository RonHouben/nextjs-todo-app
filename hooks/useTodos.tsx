import { useContext, useEffect } from "react";
import useSWR from "swr";
import { ITodosContext, TodosContext } from "../contexts/TodosContextProvider";
import { ITodo } from "../interfaces/todos";
import { fetcher, FetchError } from "../utils/fetcher";

interface IUseTodos {
  todos: ITodo[] | undefined;
  error?: FetchError;
  createTodo: (newTodo: ITodo) => void;
  updateTodo: (id: ITodo["id"], update: Partial<ITodo>) => void;
  deleteTodo: (id: ITodo["id"]) => void;
}

export default function useTodos(): IUseTodos {
  const { todos, setTodos } = useContext<ITodosContext>(TodosContext);

  const { data, error: useSWRError, mutate } = useSWR<ITodo[], FetchError>(
    "/api/todos",
    fetcher
  );

  let error: FetchError | undefined = useSWRError;

  async function createTodo(newTodo: ITodo): Promise<void> {
    // optimistically update local state
    mutate(data ? [...data, newTodo] : [newTodo], false);

    // create new Todo in database
    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
    } catch (err) {
      console.error(err);
      error = err as FetchError;
    }
  }

  async function updateTodo(
    id: ITodo["id"],
    update: Partial<ITodo>
  ): Promise<void> {
    // optimistically update local state
    mutate(
      data
        ? data.map((todo) => (todo.id === id ? { ...todo, ...update } : todo))
        : data,
      false
    );
    // call changeTodo api in backend
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    });
  }

  async function deleteTodo(id: ITodo["id"]): Promise<void> {
    // optimistically update local state
    mutate(data ? data.filter((todo) => todo.id !== id) : data, false);
    // delete the todo in backend
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
      error = err as FetchError;
    }
  }

  // set TodosContext every time data changes
  useEffect(() => {
    if (data) {
      setTodos(data);
    }
  }, [data]);

  return {
    todos,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
