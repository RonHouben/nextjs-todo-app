import React, { useState } from "react";
import useTodos from "../hooks/useTodos";
import { ITodo } from "../utils/interfaces/todos";
import ClearTextIconButton from "./IconButton";
import CompleteTodoRoundCheckbox from "./RoundCheckbox";
import Textbox from "./Textbox";
import { useSession } from "next-auth/client";

interface Props {
  autoFocus?: boolean;
}

export default function CreateTodoField({ autoFocus = false }: Props) {
  // get user from session
  const session = useSession();
  const userId = session[0]?.userId || undefined;
  // set local completed state
  const [completed, setCompleted] = useState<boolean>(false);
  // set local title state
  const [title, setTitle] = useState<ITodo["title"]>();

  // hooks
  const { createTodo } = useTodos({ userId });

  // handlers
  const handleToggleCompleted = (checked: boolean) => {
    setCompleted(checked);
  };

  const handleChangeTitle = (newTitle: ITodo["title"]) => {
    setTitle(newTitle);
  };

  const handleSubmitTodo = (title: ITodo["title"]) => {
    // add to db
    createTodo({ title, completed });
    // update local states
    setTitle("");
    setCompleted(false);
  };

  const handleClearTodo = () => {
    setTitle("");
    setCompleted(false);
  };

  return (
    <div
      id={"create-todo"}
      className={`flex w-full h-full justify-center items-center bg-light-0 dark:bg-dark-1`}
      tabIndex={0}
    >
      <CompleteTodoRoundCheckbox
        id={"create-todo-checkbox"}
        checked={completed}
        onToggle={handleToggleCompleted}
      />
      <Textbox
        value={title || ""}
        placeholder="Create a new todo..."
        onChange={handleChangeTitle}
        onSubmit={handleSubmitTodo}
        debounceDelay={0}
        autoFocus={autoFocus}
        submitOnEnterKey
        clearOnEnterKey
      />

      <ClearTextIconButton
        alt="Clear Text"
        src="/icons/icon-cross.svg"
        size="md"
        onClick={handleClearTodo}
      />
    </div>
  );
}
