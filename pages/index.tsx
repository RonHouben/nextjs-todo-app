import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { getSession, Session } from "next-auth/client";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import useTodos from "../hooks/useTodos";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import TodosList from "../components/TodosList";
import CreateTodoField from "../components/CreateTodoField";
import LoginPage from "./login";
interface InitialProps {
  initialData: ITodo[];
  session: Session | null;
}

export default function TodoApp({ initialData, session }: InitialProps) {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );

  const { clearCompleted, activeTodosLeft } = useTodos({ initialData });

  return (
    <div className="">
      {!session && <LoginPage />}
      {session && (
        <Layout pageTitle="todo">
          <Paper rounded shadow>
            {!session && <div>Not signed in</div>}
            {session && <CreateTodoField autoFocus />}
          </Paper>
          <Paper rounded shadow verticalDivider>
            <TodosList initialData={initialData} filter={selectedFilter} />
            <Filterbar
              itemsLeft={activeTodosLeft()}
              filters={[
                ITodoStatusEnum.ALL,
                ITodoStatusEnum.ACTIVE,
                ITodoStatusEnum.COMPLETED,
              ]}
              selected={selectedFilter}
              onChangeFilter={setSelectedFilter}
              onClearCompleted={clearCompleted}
            />
          </Paper>
        </Layout>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async ({
  req,
}) => {
  const session = await getSession({ req });

  console.log("sessions", session);

  // get initial todos from the backend
  // const { firestore, getDataWithId } = firebaseAdmin()

  let todos: ITodo[] = [];

  // get todos from DB
  // const snapshot = await firestore.collection('todos').orderBy('created').get()
  // add the data to the todos result array
  // snapshot.forEach((doc) => (todos = [...todos, getDataWithId(doc)]))

  // console.log('TODOS', todos)

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {
      session,
      initialData: JSON.parse(JSON.stringify(todos)),
    },
  };
};
