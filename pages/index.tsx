import React, { useContext, useEffect } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import Todo from "../components/Todo";
import { ITodosContext, TodosContext } from "../contexts/TodosContextProvider";

export default function Home() {
  const { data, error } = useSWR("/api/todos");
  const { todos, setTodos } = useContext<ITodosContext>(TodosContext);

  useEffect(() => {
    setTodos(data);
  }, [data]);

  if (error) return <div>ERROR! {error.message}</div>;
  if (!data) return <div>LOADING!</div>;

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

// export async function getServerSideProps(_context: NextPageContext) {
//   try {
//     // get todos from database
//     const initialTodos = await getTodos();

//     return {
//       props: {
//         initialTodos,
//       } as Props,
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: {
//           message: error.message,
//         },
//       } as Props,
//     };
//   }
// }
