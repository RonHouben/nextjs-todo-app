import CompleteTodoRoundCheckbox from "./RoundCheckbox";
import Textbox from "./Textbox";
import React, { useState } from "react";
import { ITodo } from "../utils/interfaces/todos";
import useTodos from "../hooks/useTodos";
import Skeleton from "react-loading-skeleton";
import SkeletonThemeWrapper from "./SkeletonThemeWrapper";
import DeleteTodoIconButton from "./IconButton";
import { useFirebaseApp, useFirestoreDocData } from "reactfire";

interface Props {
  placeholder?: string;
  id: ITodo["id"];
  initialData?: ITodo;
}

export default function Todo({ id, initialData, placeholder }: Props) {
  const { updateTodo, deleteTodo } = useTodos();
  const [focused, setFocused] = useState<boolean>(false);

  // get todo from DB
  const todoRef = useFirebaseApp().firestore().collection("todos").doc(id);
  const { data: todo } = useFirestoreDocData<ITodo>(todoRef, {
    initialData,
    idField: "id",
  });

  // handlers
  const handleChangeTitle = (title: string): void => {
    if (!title) {
      deleteTodo(id);
    } else {
      updateTodo(id, { ...todo, title });
    }
  };

  const handleToggleCompleted = (completed: boolean): void => {
    updateTodo(id, { completed });
  };

  const handleDelete = (id: ITodo["id"]): void => {
    deleteTodo(id);
  };

  return (
    <div
      id={id}
      className={`flex w-full h-full justify-center items-center p-2 bg-light-0 dark:bg-dark-1`}
      tabIndex={0}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* loading completed checkbox state*/}
      {!todo && (
        <div className="p-2">
          <Skeleton
            wrapper={SkeletonThemeWrapper}
            circle
            width="1.5rem"
            height="1.5rem"
          />
        </div>
      )}
      {todo && (
        <CompleteTodoRoundCheckbox
          id={id}
          checked={todo.completed || false}
          onToggle={handleToggleCompleted}
        />
      )}
      {!todo && (
        <div className="h-full w-full pl-4">
          <Skeleton wrapper={SkeletonThemeWrapper} />
        </div>
      )}
      {todo && (
        <Textbox
          value={todo.title}
          placeholder={placeholder || "Add a title"}
          onChange={handleChangeTitle}
          onSubmit={handleChangeTitle}
          debounceDelay={1000}
          submitOnEnterKey
          submitOnBlur
        />
      )}
      {/* delete Todo button */}
      <DeleteTodoIconButton
        alt="Delete Todo"
        src="/icons/icon-cross.svg"
        size="md"
        onClick={() => handleDelete(todo.id)}
        className={focused ? "visible" : "hidden"}
      />
    </div>
  );
}
