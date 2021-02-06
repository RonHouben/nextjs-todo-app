import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import { ITodoStatusEnum } from "../utils/interfaces/todos";
import TodosList from "../components/TodosList";
import CreateTodoField from "../components/CreateTodoField";
import { getSession } from "next-auth/client";
import { ISession } from "../lib/firebaseAdapter";
import useTodos from "../hooks/useTodos";
import { toast } from "react-toastify";
import registerToastServiceWorker from "../utils/registerToastServiceWorker";
import useFirebaseCloudMessaging from "../hooks/useFirebaseCloudMessaging";
import Todo from "../components/Todo";
import { firebaseClient } from "../lib/firebaseClient";
interface Props {
  userId: string;
}

// This shows a toast on service worker lifecycle changes
registerToastServiceWorker(toast);

export default function TodoApp({ userId }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );
  // set the userId for Firebase Analytics
  useEffect(() => {
    firebaseClient.analytics().setUserId(userId);
    firebaseClient.analytics().setCurrentScreen("home_screen");
  }, [userId, selectedFilter]);

  // this shows a toast when a foreground message arrives from Firebase Cloud Messsaging
  useFirebaseCloudMessaging();

  const { getTodos, deleteTodo } = useTodos();

  const { todos, loading } = getTodos({
    userId,
    filter: selectedFilter,
  });

  // handlers
  const handleClearCompleted = () => {
    // get all completed todos
    const completedTodos = todos?.filter((todo) => todo.completed) || [];
    // remove each complete todo
    completedTodos.forEach(async ({ id }) => deleteTodo(id));
    // log analytics event
    firebaseClient.analytics().logEvent("cleared_completed", {
      todos: completedTodos.map((todo) => todo.id),
    });
  };

  const handleChangeFilter = (newFilter: ITodoStatusEnum) => {
    // log analytics event
    firebaseClient.analytics().logEvent("changed_todos_filter", {
      before: selectedFilter,
      after: newFilter,
    });
    // setSelectedFilter local state
    setSelectedFilter(newFilter);
  };

  return (
    <Layout>
      <Paper rounded shadow className="w-full">
        <CreateTodoField autoFocus />
      </Paper>
      <Paper rounded shadow verticalDivider className="w-full">
        {loading && <Todo />}
        {!loading && todos && <TodosList todos={todos || []} />}
        <Filterbar
          itemsLeft={todos?.length || 0}
          filters={[
            ITodoStatusEnum.ALL,
            ITodoStatusEnum.ACTIVE,
            ITodoStatusEnum.COMPLETED,
          ]}
          selected={selectedFilter}
          onChangeFilter={handleChangeFilter}
          onClearCompleted={handleClearCompleted}
        />
      </Paper>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
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

  return {
    props: {
      userId: session.userId,
    },
  };
};
