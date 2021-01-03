import RoundCheckbox from "./RoundCheckbox";
import Textbox from "./Textbox";
import { useEffect, useState } from "react";
import { ITodo } from "../interfaces/todos";
import Image from "next/image";
import useTodos from "../hooks/useTodos";

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
  const { createTodo, updateTodo, deleteTodo } = useTodos();
  const [focus, setFocus] = useState<boolean>(false);

  // handlers
  const handleChangeTitle = (id: ITodo["id"], title: string): void => {
    // create a new todo if createNewTodo === true
    if (createNewTodo) {
      createTodo({ ...todo, title, completed: false });
    } else {
      updateTodo(id, { ...todo, title });

      // set focus on Todo
      document.getElementById(id || "new-todo")?.focus();
    }
  };

  const handleToggleCompleted = (id: ITodo["id"], completed: boolean): void => {
    console.log("PING", id, completed);
    if (id !== "new-todo") {
      updateTodo(id, { ...todo, completed });
    }
    setTodo((prevTodo) =>
      prevTodo
        ? ({ ...prevTodo, completed: !prevTodo.completed } as ITodo)
        : undefined
    );
  };

  const handleDelete = (id: ITodo["id"]): void => {
    deleteTodo(id);
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
        checked={todo?.completed || false}
        onChange={handleToggleCompleted}
      />
      <Textbox
        value={todo?.title}
        placeholder={placeholder || "Add a title"}
        onChange={(newTitle) => handleChangeTitle(todo?.id, newTitle)}
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
