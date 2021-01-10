import { NextApiRequest, NextApiResponse } from 'next'
import { ITodo } from '../../../utils/interfaces/todos'
import HttpStatusCode from '../../../utils/interfaces/HttpStatusCodes.enum'
import firebaseAdmin from '../../../lib/firebaseAdmin'

// get firebaseAdmin helpers
const { firestore, getDataWithId, serverTimestamp } = firebaseAdmin()

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

        return res.status(HttpStatusCode.OK).json(todos)
      } catch (err) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      }
    case 'POST':
      try {
        const createdTodo = await createTodo(body)
        return res.status(HttpStatusCode.CREATED).json(createdTodo)
      } catch (e) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: e.message,
          },
        })
      }
    case 'DELETE':
      // get id's from query string
      try {
        if (!query.ids) {
          // return a bad request that tells the user to add ids in the query params
          return res.status(HttpStatusCode.BAD_REQUEST).json({
            error: {
              message:
                "Please add the `ids=[]` query parameter that contains the id's in a comma seperated list i.e. `ids=[1, 2, 3]`",
            },
          })
        }
        // create an array out of the query.ids
        const ids = JSON.parse(query.ids as string)

        // delete the ids from the DB
        const result = await deleteTodos(ids)
        const isBadRequest: boolean = result.failed.length > 0

        return res
          .status(
            isBadRequest ? HttpStatusCode.MULTI_STATUS : HttpStatusCode.OK
          )
          .json(result)
      } catch (err) {
        console.error(err)

        return res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: err.message,
          },
        })
      }
    default:
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
        error: {
          message: `${req.method} is not allowed`,
        },
      })
  }
}

export async function getTodos(): Promise<ITodo[]> {
  const snapshot = await firestore.collection('todos').orderBy('created').get()

  let todos: ITodo[] = []

  snapshot.forEach((doc) => (todos = [...todos, getDataWithId(doc)]))

  return todos
}

async function createTodo(todo: ITodo): Promise<ITodo> {
  // append default data
  const newTodoWithDefaults = {
    ...todo,
    created: serverTimestamp,
    completed: false,
  } as ITodo

  const newTodoDocRef = await firestore
    .collection('todos')
    .add({ ...newTodoWithDefaults })
  const newTodoDocSnapshot = await newTodoDocRef.get()

  return getDataWithId<ITodo>(newTodoDocSnapshot)
}

interface IFailedTodo {
  id: ITodo['id']
  reason: string
}

export interface IDeleteTodosResult {
  successfull: ITodo['id'][]
  failed: IFailedTodo[]
}

async function deleteTodos(ids: string[]): Promise<IDeleteTodosResult> {
  // set variables for the result
  let successfull = [] as IDeleteTodosResult['successfull']
  let failed = [] as IDeleteTodosResult['failed']

  // delete Todo for each ids
  for (const id of ids) {
    try {
      // delete from DB
      const docRef = firestore.collection('todos').doc(id)
      const docSnapshot = await docRef.get()

      if (docSnapshot.data()) {
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
