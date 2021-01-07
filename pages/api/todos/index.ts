import { NextApiRequest, NextApiResponse } from 'next'
import { ITodo } from '../../../utils/interfaces/todos'
import HttpStatusCode from '../../../utils/interfaces/HttpStatusCodes.enum'
import firebase from '../../../lib/firebase'
import { firebaseServerTimestamp } from '../../../utils/firebaseClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const body: ITodo = req.body
  const query = req.query

  // Get data from your database
  switch (req.method) {
    case 'GET':
      // get all Todo's from the database
      try {
        const todos: ITodo[] = await getTodos()

        res.status(HttpStatusCode.OK).json(todos)
        return
      } catch (err) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        return
      }
    case 'POST':
      try {
        const createdTodo = await createTodo(body)
        res.status(HttpStatusCode.CREATED).json(createdTodo)
        return
      } catch (e) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: e.message,
          },
        })
        return
      }
    case 'DELETE':
      // get id's from query string
      try {
        if (!query.ids) {
          // return a bad request that tells the user to add ids in the query params
          res.status(HttpStatusCode.BAD_REQUEST).json({
            error: {
              message:
                "Please add the `ids=[]` query parameter that contains the id's in a comma seperated list i.e. `ids=[1, 2, 3]`",
            },
          })
          return
        }
        // create an array out of the query.ids
        const ids = JSON.parse(query.ids as string)

        // delete the ids from the DB
        const result = await deleteTodos(ids)
        const isBadRequest: boolean = result.failed.length > 0

        res
          .status(
            isBadRequest ? HttpStatusCode.MULTI_STATUS : HttpStatusCode.OK
          )
          .json(result)
        return
      } catch (err) {
        console.error(err)
        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: err.message,
          },
        })
        return
      }
    default:
      res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
        error: {
          message: `${req.method} is not allowed`,
        },
      })
      return
  }
}

export async function getTodos(): Promise<ITodo[]> {
  const collectionRef = await firebase.collection('todos')
  const snapshot = await collectionRef.get()

  let todos: ITodo[] = []

  snapshot.forEach((doc) => todos.push({ ...doc.data(), id: doc.id } as ITodo))

  return todos
}

export async function createTodo(todo: ITodo): Promise<ITodo> {
  // append default data
  const newTodoWithDefaults = {
    ...todo,
    created: firebaseServerTimestamp,
    completed: false,
  } as ITodo

  const newTodoDoc = await firebase
    .collection('todos')
    .add({ ...newTodoWithDefaults })
  const snapshot = await newTodoDoc.get()

  return { id: snapshot.id, ...snapshot.data() } as ITodo
}

interface IFailedTodo {
  id: ITodo['id']
  reason: string
}

export interface IDeleteTodosResult {
  successfull: ITodo['id'][]
  failed: IFailedTodo[]
}

export async function deleteTodos(ids: string[]): Promise<IDeleteTodosResult> {
  // set variables for the result
  let successfull = [] as IDeleteTodosResult['successfull']
  let failed = [] as IDeleteTodosResult['failed']

  // delete Todo for each ids
  for (const id of ids) {
    try {
      // delete from DB
      const docRef = firebase.collection('todos').doc(id)
      const todo = await docRef.get()

      if (todo.data()) {
        await docRef.delete()
        // add to successful array
        successfull = [...successfull, id]
      } else {
        throw new Error("couldn't find the todo in the database")
      }
    } catch (err) {
      console.error('ERROR', err)
      // add to failed array
      failed = [...failed, { id, reason: err.message }]
    }
  }

  // return result
  return {
    successfull,
    failed,
  }
}
