import React, { Fragment } from "react";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import Todo from "./Todo";
import { useSession } from "next-auth/client";
import useTodos from "../hooks/useTodos";
interface Props {
  initialData?: ITodo[];
  filter?: ITodoStatusEnum;
}
export default function TodosList({ initialData, filter }: Props) {
  const [session] = useSession();

  const { getTodos } = useTodos({
    initialData,
    filter,
    userId: ((session?.userId as unknown) as string) || undefined,
  });
  const { data: todos, error } = getTodos();

  return (
    <Fragment>
      {status === "error" && <div>ERROR {error?.message}</div>}

      {todos &&
        todos.length > 0 &&
        todos.map((todo) => (
          <Todo key={todo.id} id={todo.id} initialData={todo} />
        ))}
    </Fragment>
  );
}
