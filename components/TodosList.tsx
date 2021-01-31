import React, { Fragment } from "react";
import { ITodo } from "../utils/interfaces/todos";
import Todo from "./Todo";
interface Props {
  todos: ITodo[];
}
export default function TodosList({ todos }: Props) {
  return (
    <Fragment>
      {todos.length > 0 &&
        todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
    </Fragment>
  );
}
