import { NextApiRequest, NextApiResponse } from "next";
import { ITodo } from "../../../interfaces/todos";
import HttpStatusCode from "../../../interfaces/HttpStatusCodes.enum";
import firebase from "../../../utils/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const id = req.query.id as ITodo["id"];
  const body: ITodo = req.body;

  // Get data from your database
  switch (req.method) {
    case "PUT":
      try {
        const updatedTodo = await updateTodo(id, body);

        res.status(HttpStatusCode.OK).json(updatedTodo);
      } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            message: error.message,
          },
        });
      }
      break;

    case "DELETE":
      try {
        await deleteTodo(id);
        res.status(HttpStatusCode.NO_CONTENT).json({});
      } catch (e) {
        console.error(e.message);

        res.status(HttpStatusCode.BAD_REQUEST).json(e);
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

export async function deleteTodo(id: ITodo["id"]): Promise<void> {
  const snapshot = firebase.collection("todos").doc(id);
  await snapshot.delete();
}

export async function updateTodo(
  id: ITodo["id"],
  update: Partial<ITodo>
): Promise<ITodo> {
  try {
    const snapshot = firebase.collection("todos").doc(id);
    await snapshot.update(update);

    const updatedTodoSnapshot = await snapshot.get();

    const test = { ...(updatedTodoSnapshot.data() as ITodo), id };
    console.log("TEST", test);
    return test;
  } catch (error) {
    throw new Error(`Couldn't find Todo with id: ${id} ${error.message}`);
  }
}
