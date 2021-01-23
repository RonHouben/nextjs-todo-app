import _ from "lodash";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import firebase from "firebase/app";
import { ObservableStatus, useFirestoreCollectionData } from "reactfire";
import { firebaseApp, firestoreServerTimestamp } from "../lib/firebaseClient";
interface Props {
  initialData?: ITodo[];
  filter?: ITodoStatusEnum;
  userId?: string;
}
interface IUseTodosResult {
  getTodos: () => ObservableStatus<ITodo[]>;
  createTodo: (newTodo: Partial<ITodo>) => void;
  updateTodo: (id: ITodo["id"], update: Partial<ITodo>) => void;
  deleteTodo: (id: ITodo["id"]) => void;
  clearCompleted: () => void;
  activeTodosLeft: () => number;
}

export default function useTodos({
  initialData,
  filter,
  userId,
}: Props = {}): IUseTodosResult {
  // initiate Firebase
  const FIRESTORE = firebaseApp.firestore();
  interface GetTodosProps {
    firestore: firebase.firestore.Firestore;
    initialData?: ITodo[];
    filter?: ITodoStatusEnum;
    userId?: string;
  }

  function getTodos({ firestore, initialData, filter, userId }: GetTodosProps) {
    // get the query
    const query = filter
      ? getQuery({
          firestore,
          collectionPath: "todos",
          whereFilterOptions: getWhereFilterOptions(filter),
          userId,
        })
      : getQuery({ firestore, collectionPath: "todos", userId });

    // get the data from the DB
    return useFirestoreCollectionData<ITodo>(query, {
      initialData,
      idField: "id",
    });
  }

  async function createTodo(
    userId: string = "",
    newTodo: Partial<ITodo>
  ): Promise<void> {
    try {
      if (!userId)
        throw new Error(
          "please specify a userId when initializing the useTodos hook"
        );

      await FIRESTORE.collection("todos").add({
        ...newTodo,
        created: firestoreServerTimestamp(),
        userId,
      });
    } catch (error) {
      console.error("[useTodos][createTodo]", error.message);
    }
  }

  async function updateTodo(
    id: ITodo["id"],
    update: Partial<ITodo>
  ): Promise<void> {
    await FIRESTORE.collection("todos").doc(id).update(update);
  }

  async function deleteTodo(id: ITodo["id"]): Promise<void> {
    await FIRESTORE.collection("todos").doc(id).delete();
  }

  async function clearCompleted(): Promise<void> {
    // create the query
    const query = getQuery({
      firestore: FIRESTORE,
      collectionPath: "todos",
      whereFilterOptions: getWhereFilterOptions(ITodoStatusEnum.COMPLETED),
    });
    // get the snapshot
    const snapshot = await query.get();
    // create a batch
    const batch = FIRESTORE.batch();
    // delete documents
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    // commit the batch
    await batch.commit();
  }

  // helper functions
  type GetWhereFilterOptionsResult = [
    string | firebase.firestore.FieldPath,
    firebase.firestore.WhereFilterOp,
    any
  ];

  function getWhereFilterOptions(
    filter: ITodoStatusEnum
  ): GetWhereFilterOptionsResult | undefined {
    switch (filter) {
      case ITodoStatusEnum.ACTIVE:
        return ["completed", "!=", true];
      case ITodoStatusEnum.COMPLETED:
        return ["completed", "==", true];
      default:
        return undefined;
    }
  }

  interface GetQueryProps {
    firestore: firebase.firestore.Firestore;
    whereFilterOptions?: GetWhereFilterOptionsResult;
    collectionPath: string;
    userId?: string;
  }

  function getQuery({
    firestore,
    collectionPath,
    whereFilterOptions,
    userId,
  }: GetQueryProps) {
    if (userId && whereFilterOptions) {
      return firestore
        .collection(collectionPath)
        .where(...whereFilterOptions)
        .where("userId", "==", userId);
    } else if (!userId && whereFilterOptions) {
      return firestore.collection(collectionPath).where(...whereFilterOptions);
    } else if (userId && !whereFilterOptions) {
      return firestore.collection(collectionPath).where("userId", "==", userId);
    } else {
      return firestore.collection(collectionPath);
    }
  }

  return {
    getTodos: () =>
      getTodos({ firestore: FIRESTORE, initialData, filter, userId }),
    createTodo: (newTodo) => createTodo(userId, newTodo),
    updateTodo,
    deleteTodo,
    clearCompleted,
    activeTodosLeft: () => {
      const { data } = getTodos({
        firestore: FIRESTORE,
        filter: ITodoStatusEnum.ACTIVE,
        userId,
      });

      return data?.length || 0;
    },
  };
}
