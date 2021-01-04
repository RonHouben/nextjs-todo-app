import { NextApiRequest, NextApiResponse } from "next";
import { ITodo } from "../../../interfaces/todos";
import HttpStatusCode from "../../../interfaces/HttpStatusCodes.enum";
import firebase from "../../../utils/firebase";
import { FilterLabel } from "../../../components/Filterbar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const body: ITodo = req.body;

  console.log("QUERY", req.query);

  // Get data from your database
  switch (req.method) {
    case "GET":
      // get all Todo's from the database
      try {
        const filterBy = req.query.filter as FilterLabel;
        console.log("PING", filterBy);
        const todos: ITodo[] = await getTodos(filterBy);

        res.status(HttpStatusCode.OK).json(todos);
        break;
      } catch (err) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
        break;
      }
    case "POST":
      try {
        const createdTodo = await createTodo(body);
        res.status(HttpStatusCode.OK).json(createdTodo);
      } catch (e) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: e.message,
          },
        });
      }
      break;
    default:
      res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
        error: {
          message: `${req.method} is not allowed`,
        },
      });
      break;
  }
}

export async function getTodos(filterBy: FilterLabel): Promise<ITodo[]> {
  let snapshot: any;

  console.log("getTodos filterBy", filterBy);
  const query = await firebase.collection("todos");

  switch (filterBy) {
    case "All":
      snapshot = await query.get();
      break;
    case "Active":
      snapshot = await query.where("completed", "==", false).get();
      break;
    case "Completed":
      snapshot = await query.where("completed", "==", true).get();
      break;
    // default:
    // snapshot = await query.get();
    // break;
  }

  // console.log("SNAPSHOT", snapshot);
  let todosData: ITodo[] = [];

  snapshot.forEach(
    (doc) =>
      (todosData = [...todosData, { ...doc.data(), id: doc.id } as ITodo])
  );

  console.log("TODOS_DATA", todosData);
  return todosData;
}

export async function createTodo(todo: ITodo): Promise<ITodo> {
  const newTodoDoc = await firebase.collection("todos").add({ ...todo });
  const snapshot = await newTodoDoc.get();

  return { ...snapshot.data(), id: snapshot.id } as ITodo;
}
