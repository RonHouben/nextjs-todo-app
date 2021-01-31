import { GetServerSideProps } from "next";
import React, { useState } from "react";
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
interface Props {
  userId: string;
}

// This shows a toast on service worker lifecycle changes
registerToastServiceWorker(toast);

export default function TodoApp({ userId }: Props) {
  // local state
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );

  // this shows a toast when a foreground message arrives from Firebase Cloud Messsaging
  useFirebaseCloudMessaging();

  const { getTodos, deleteTodo } = useTodos();

  const { todos, loading } = getTodos({
    userId,
    filter: selectedFilter,
  });

  // handlers
  const handleClearCompleted = () => {
    const completedTodos = todos?.filter((todo) => todo.completed) || [];
    // remove each complete todo
    completedTodos.forEach(async ({ id }) => deleteTodo(id));
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
          onChangeFilter={setSelectedFilter}
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
