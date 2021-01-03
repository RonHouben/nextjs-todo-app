import React from "react";
import Layout from "../components/Layout";
import Todo from "../components/Todo";
import useTodos from "../hooks/useTodos";

export default function Home() {
  const { todos, error } = useTodos();

  if (error) return <div>ERROR! {error.message}</div>;

  return (
    <Layout pageTitle="TODO">
      <div className="flex flex-col justify-start items-center space-y-7 w-full">
        <Todo createNewTodo autoFocus placeholder="Create a new todo..." />
        <div className="w-full h-full rounded-md">
          {!todos && <Todo />}
          {todos && todos.map((todo, i) => <Todo key={i} todoData={todo} />)}
        </div>
      </div>
    </Layout>
  );
}
