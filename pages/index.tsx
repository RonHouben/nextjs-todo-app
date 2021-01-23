import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import useTodos from "../hooks/useTodos";
import { ITodoStatusEnum } from "../utils/interfaces/todos";
import TodosList from "../components/TodosList";
import CreateTodoField from "../components/CreateTodoField";
import { getSession } from "next-auth/client";
import { ISession } from "../lib/firebaseAdapter";

export default function TodoApp() {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );

  const { clearCompleted, activeTodosLeft } = useTodos();

  return (
    <div className="">
      <Layout>
        <Paper rounded shadow className="w-full">
          <CreateTodoField autoFocus />
        </Paper>
        <Paper rounded shadow verticalDivider className="w-full">
          <TodosList filter={selectedFilter} />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = ((await getSession({ req })) as unknown) as ISession;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};
