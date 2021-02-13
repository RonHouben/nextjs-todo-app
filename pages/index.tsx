import { GetServerSideProps } from "next";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Filterbar from "../components/Filterbar";
import Paper from "../components/Paper";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
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
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
  }, [userId]);

  // get todos from database
  const query = useMemo(() => {
    const collection = firebaseClient.firestore().collection("todos");

    const baseQuery = collection
      .where("userId", "==", userId)
      .orderBy("order", "asc");

    // return baseQuery;
    switch (selectedFilter) {
      case ITodoStatusEnum.ALL:
        return baseQuery;
      case ITodoStatusEnum.ACTIVE:
        return baseQuery.where("completed", "==", false);
      case ITodoStatusEnum.COMPLETED:
        return baseQuery.where("completed", "==", true);
    }
  }, [firebaseClient, userId, selectedFilter]);

  // get
  const [todos, loading, error] = useCollectionData<ITodo>(query, {
    idField: "id",
  });

  query.get();

  // this shows a toast when a foreground message arrives from Firebase Cloud Messsaging
  useFirebaseCloudMessaging();

  const { deleteTodo, reorderTodos } = useTodos();

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

  const handleDragEnd = (result: DropResult, _provided: ResponderProvided) => {
    const { source, destination } = result;
    // dropped outside list
    if (!destination || destination.index === source.index) {
      return;
    }

    // updateTodo(draggableId, { updatedAt: firestoreTimestamp.now() });

    const reorderedTodos = reorder<ITodo>(
      todos,
      source.index,
      destination.index
    );
    const reorderedTodoIds = reorderedTodos.map(({ id }) => id);
    // // save new order in the database
    reorderTodos(reorderedTodoIds);
    // log analytics event
    firebaseClient.analytics().logEvent("changed_todos_order", {
      before: todos?.map(({ id }) => id) || [],
      after: reorderedTodoIds,
    });
  };

  // helper function
  function reorder<T>(
    list: T[] = [],
    startIndex: number,
    endIndex: number
  ): T[] {
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed!);

    return list;
  }

  return (
    <Layout>
      <Paper rounded shadow className="w-full">
        <CreateTodoField autoFocus />
      </Paper>
      <Paper rounded shadow verticalDivider className="w-full">
        {loading && <Todo />}
        {!loading && todos && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <TodosList todos={todos || []} />
          </DragDropContext>
        )}
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
