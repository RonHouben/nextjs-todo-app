import RoundCheckbox from "./RoundCheckbox";
import Textbox from "./Textbox";
import { useContext, useEffect, useState } from "react";
import { ITodo } from "../interfaces/todos";
import { ITodosContext, TodosContext } from "../contexts/TodosContextProvider";
import Image from "next/image";

interface Props {
  placeholder?: string;
  todoData?: ITodo;
  createNewTodo?: boolean;
  autoFocus?: boolean;
}

export default function Todo({
  todoData,
  placeholder,
  createNewTodo = false,
  autoFocus = false,
}: Props) {
  const [todo, setTodo] = useState<ITodo | undefined>(todoData);
  const { setTodos } = useContext<ITodosContext>(TodosContext);
  const [focus, setFocus] = useState<boolean>(false);

  const createTodo = async (newTodo: ITodo): Promise<void> => {
    // optimisticly update TodosContext
    setTodos((prevTodos) => [...prevTodos, newTodo] as ITodo[]);

    // create new Todo in database
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      const createdTodo: ITodo = await response.json();

      // update TodoContext that adds the database id
      setTodos((prevTodos) =>
        prevTodos.map((prevTodo) =>
          !prevTodo.id && prevTodo.title === newTodo.title
            ? { ...prevTodo, id: createdTodo.id }
            : prevTodo
        )
      );
    } catch (e) {
      console.error(e.message);
    }
  };

  const updateTodo = async (
    id: ITodo["id"],
    update: Partial<ITodo>
  ): Promise<void> => {
    // optimistically update the local Todo state
    setTodo((prevTodo) => (prevTodo ? { ...prevTodo, ...update } : undefined));
    // optimistically update TodosContex
    setTodos((prevTodos) =>
      prevTodos.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, ...update } : prevTodo
      )
    );
    // call changeTodo api in backend
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    });
  };

  // handlers
  const handleChangeTitle = (title: string): void => {
    // create a new todo if createNewTodo === true
    if (createNewTodo) {
      createTodo({ ...todo, title } as ITodo);
    } else {
      // update existing todo
      updateTodo(todo!.id, { ...todo, title });

      // set focus on Todo
      document.getElementById(todo?.id || "new-todo")?.focus();
    }
  };

  const handleToggleCompleted = (): void => {
    setTodo((prevTodo) =>
      prevTodo
        ? ({ ...prevTodo, completed: !prevTodo.completed } as ITodo)
        : undefined
    );
  };

  const handleDelete = async (id: ITodo["id"]): Promise<void> => {
    // optimistically update TodoContext
    setTodos((prevTodos) => prevTodos!.filter((todo) => todo.id !== id));
    // delete the todo in backend
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  // update local states
  useEffect(() => {
    setTodo(todoData);
  }, [todoData]);

  return (
    <div
      id={todo?.id || "new-todo"}
      className="flex w-full h-full justify-center items-center rounded-md p-3 shadow-lg bg-light-0 dark:bg-dark-1 "
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      <RoundCheckbox
        id={todo?.id || "new-todo"}
        onChange={handleToggleCompleted}
      />
      <Textbox
        value={todo?.title}
        placeholder={placeholder || "Add a title"}
        onChange={handleChangeTitle}
        debounceDelay={2000}
        submitOnEnterKey
        // submitOnBlur={!createNewTodo}
        autoFocus={autoFocus}
        clearOnEnterKey={createNewTodo}
      />
      {/* delete Todo button */}
      <div
        className={`relative w-5 h-5 m-2 ${
          !focus || createNewTodo ? "hidden" : ""
        }`}
        onClick={() => handleDelete(todo!.id)}
        onKeyPress={() => handleDelete(todo!.id)}
        tabIndex={0}
      >
        <Image
          className="cursor-pointer"
          layout="fill"
          src="/images/icon-cross.svg"
        />
      </div>
    </div>
  );
}
