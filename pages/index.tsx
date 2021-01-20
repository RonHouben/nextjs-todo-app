import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import useTodos from "../hooks/useTodos";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import TodosList from "../components/TodosList";
import CreateTodoField from "../components/CreateTodoField";
import { getSession } from "next-auth/client";
import firebaseAdmin from "../lib/firebaseAdmin";
import { ISession } from "../lib/firebaseAdapter";
interface InitialProps {
  initialData: ITodo[];
}

export default function TodoApp({ initialData }: InitialProps) {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );

  const { clearCompleted, activeTodosLeft } = useTodos({ initialData });

  return (
    <div className="">
      <Layout>
        <Paper rounded shadow className="w-full">
          <CreateTodoField autoFocus />
        </Paper>
        <Paper rounded shadow verticalDivider className="w-full">
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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async ({
  req,
}) => {
  const session = ((await getSession({ req })) as unknown) as ISession;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  // get initial todos from the backend
  const { firestore, getDataWithId } = firebaseAdmin();

  // initalize empty todos array
  let todos: ITodo[] = [];

  // get todos from DB
  const snapshot = await firestore
    .collection("todos")
    .where("userId", "==", session.userId)
    .orderBy("created")
    .get();

  // add the data to the todos result array
  snapshot.forEach((doc) => (todos = [...todos, getDataWithId(doc)]));

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(todos)),
    },
  };
};
