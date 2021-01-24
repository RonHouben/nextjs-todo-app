import { GetServerSideProps } from "next";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import TodosList from "../components/TodosList";
import CreateTodoField from "../components/CreateTodoField";
import { getSession } from "next-auth/client";
import { ISession } from "../lib/firebaseAdapter";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import useTodos from "../hooks/useTodos";
import { firestore } from "firebase-admin";

interface Props {
  userId: string;
  initialData: Stringified<ITodo[]>;
}

export default function TodoApp({ userId, initialData }: Props) {
  // local state
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  );
  const { getWhereFilterOptions, getQuery } = useTodos();
  // get firestore client and get todos
  const firestore = useFirestore();

  // create query
  const queryFilter = getWhereFilterOptions(selectedFilter);
  const query = getQuery({
    collectionPath: "todos",
    userId,
    whereFilterOptions: queryFilter,
  });
  // get data
  const { data: todos, status } = useFirestoreCollectionData<ITodo>(query, {
    idField: "id",
    initialData: JSON.parse(initialData),
  });

  // handlers
  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    // remove each complete todo
    completedTodos.forEach(async ({ id }) =>
      firestore.collection("todos").doc(id).delete()
    );
  };

  return (
    <Layout>
      <Paper rounded shadow className="w-full">
        <CreateTodoField autoFocus />
      </Paper>
      <Paper rounded shadow verticalDivider className="w-full">
        <TodosList todos={todos} />
        <Filterbar
          itemsLeft={status === "success" ? todos.length : 0}
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

  // get initialData
  const snapshot = await firestore()
    .collection("todos")
    .where("userId", "==", session.userId)
    .get();

  const initialData: ITodo[] = snapshot.docs.map((todo) => {
    return {
      ...todo.data(),
      id: todo.id,
    } as ITodo;
  });

  return {
    props: {
      userId: session.userId,
      initialData: JSON.stringify(initialData),
    },
  };
};
