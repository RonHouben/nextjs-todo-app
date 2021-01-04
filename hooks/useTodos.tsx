import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { FilterLabel } from "../components/Filterbar";
import { ITodosContext, TodosContext } from "../contexts/TodosContextProvider";
import { ITodo } from "../interfaces/todos";
import { fetcher, FetchError } from "../utils/fetcher";

interface Options {
  filterBy?: FilterLabel;
}
interface IUseTodos {
  todos: ITodo[] | undefined;
  itemsLeft: number;
  error?: FetchError;
  createTodo: (newTodo: Partial<ITodo>) => void;
  updateTodo: (id: ITodo["id"], update: Partial<ITodo>) => void;
  deleteTodo: (id: ITodo["id"]) => void;
  filter: (filterName: FilterLabel) => void;
}

export default function useTodos({ filterBy }: Options = {}): IUseTodos {
  const [initialTodos, setInitialTodos] = useState<ITodo[]>([]);
  const { todos, setTodos } = useContext<ITodosContext>(TodosContext);

  const { data, error: useSWRError, mutate } = useSWR<ITodo[], FetchError>(
    `/api/todos?filter=${filterBy}`,
    fetcher
  );

  useEffect(() => {
    if (!initialTodos && data) {
      setInitialTodos(data);
    }
  }, [data]);

  let ERROR: FetchError | undefined = useSWRError;

  async function createTodo(newTodo: Partial<ITodo>): Promise<void> {
    // append default data
    const newTodoWithDefaults = {
      created: new Date(),
      completed: false,
      ...newTodo,
    } as ITodo;
    // optimistically update local state
    mutate(data ? [...data, newTodoWithDefaults] : [newTodoWithDefaults], true);

    // create new Todo in database
    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoWithDefaults),
      });
    } catch (err) {
      console.error(err);
      ERROR = err as FetchError;
    }
    // revalidate after db call
    mutate();
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
      true
    );

    // call changeTodo api in backend
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });
      // revalidate after db call
      mutate();
    } catch (err) {
      console.error(err);
      ERROR = err as FetchError;
    }
  }

  async function deleteTodo(id: ITodo["id"]): Promise<void> {
    // optimistically update local state
    mutate(data ? data.filter((todo) => todo.id !== id) : data, true);
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
      ERROR = err as FetchError;
    }
    // revalidate after db call
    mutate();
  }

  async function filter(filterName: FilterLabel): Promise<void> {
    if (filterName === "All") {
      try {
        const response = await fetch("/api/todos");
        const result = (await response.json()) as ITodo[];

        setTodos(result);
        return;
      } catch (err) {
        console.error(err);
        ERROR = err as FetchError;
        return;
      }
    }
    if (filterName === "Active") {
      const response = await fetch("/api/todos");
      const result = (await response.json()) as ITodo[];

      setTodos(result.filter((todo) => !todo.completed));

      return;
    }
    if (filterName === "Completed") {
      const response = await fetch("/api/todos");
      const result = (await response.json()) as ITodo[];

      setTodos(result.filter((todo) => todo.completed));

      return;
    }
  }

  // set TodosContext every time data changes
  useEffect(() => {
    if (data) {
      // by default sorted by created date time
      const sortedByCreatedDate = _.sortBy(data, (todo) => todo.created);
      setTodos(sortedByCreatedDate);
    }
  }, [data]);

  return {
    todos,
    error: ERROR,
    createTodo,
    updateTodo,
    deleteTodo,
    itemsLeft: data?.filter((todo) => !todo.completed).length || 0,
    filter,
  };
}
