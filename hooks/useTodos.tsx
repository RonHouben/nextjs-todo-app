import _ from "lodash";
import { ITodo, ITodoStatusEnum } from "../utils/interfaces/todos";
import firebase from "firebase/app";
import { ObservableStatus, useFirestoreCollectionData } from "reactfire";
import { firebaseApp, firestoreServerTimestamp } from "../lib/firebaseClient";
import { toast } from "react-toastify";

interface IUseTodosResult {
  getTodos: (props: GetTodosProps) => ObservableStatus<ITodo[]>;
  createTodo: (userId: string, newTodo: Partial<ITodo>) => void;
  updateTodo: (id: ITodo["id"], update: Partial<ITodo>) => void;
  deleteTodo: (id: ITodo["id"]) => void;
  getWhereFilterOptions: (
    filter: ITodoStatusEnum
  ) => GetWhereFilterOptionsResult | undefined;
  getQuery: (props: GetQueryProps) => firebase.firestore.Query;
}

type GetWhereFilterOptionsResult = [
  string | firebase.firestore.FieldPath,
  firebase.firestore.WhereFilterOp,
  any
];
interface GetTodosProps {
  initialData?: ITodo[];
  filter?: ITodoStatusEnum;
  userId: string;
}

interface GetQueryProps {
  whereFilterOptions?: GetWhereFilterOptionsResult;
  collectionPath: string;
  userId?: string;
}

export default function useTodos(): IUseTodosResult {
  // initiate Firebase
  const FIRESTORE = firebaseApp.firestore();

  function getTodos({ initialData, filter, userId }: GetTodosProps) {
    // get the query
    const query = filter
      ? getQuery({
          collectionPath: "todos",
          whereFilterOptions: getWhereFilterOptions(filter),
          userId,
        })
      : getQuery({ collectionPath: "todos", userId });

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
      toast(`Created "${newTodo.title}"`, { type: "success" });
    } catch (error) {
      console.error("[useTodos][createTodo]", error.message);
      toast(error.message, { type: "error" });
    }
  }

  async function updateTodo(
    id: ITodo["id"],
    update: Partial<ITodo>
  ): Promise<void> {
    await FIRESTORE.collection("todos").doc(id).update(update);
  }

  async function deleteTodo(id: ITodo["id"]): Promise<void> {
    try {
      const snapshot = await FIRESTORE.collection("todos").doc(id).get();
      const data = (await snapshot.data()) as ITodo;

      snapshot.ref.delete();

      toast(`Deleted "${data.title}`, { type: "success" });
    } catch (error) {
      console.error("[userTodos][deleteTod]", error.message);
    }
  }

  // helper functions
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

  function getQuery({
    collectionPath,
    whereFilterOptions,
    userId,
  }: GetQueryProps) {
    if (userId && whereFilterOptions) {
      return FIRESTORE.collection(collectionPath)
        .where(...whereFilterOptions)
        .where("userId", "==", userId);
    } else if (!userId && whereFilterOptions) {
      return FIRESTORE.collection(collectionPath).where(...whereFilterOptions);
    } else if (userId && !whereFilterOptions) {
      return FIRESTORE.collection(collectionPath).where("userId", "==", userId);
    } else {
      return FIRESTORE.collection(collectionPath);
    }
  }

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getWhereFilterOptions,
    getQuery,
  };
}
