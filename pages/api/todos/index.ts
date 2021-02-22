import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '../../../lib/firebaseAdmin'
import HttpStatusCode from '../../../utils/interfaces/HttpStatusCodes.enum'
import { ITodo } from '../../../utils/interfaces/todo'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const todo: ITodo = req.body
  const query = req.query

  const { firestore, getDataWithId, serverTimestamp } = firebaseAdmin()

  // Get data from your database
  switch (req.method) {
    case 'GET':
      // get all Todo's from the database
      try {
        // get the snapshot
        const query = await firestore.collection('todos').orderBy('created')

        const snapshot = await query.get()

        // create todos result array
        let todos: ITodo[] = []

        // append each doc from snapshot to the todos result array
        snapshot.forEach((doc) => (todos = [...todos, getDataWithId(doc)]))

        // return the result
        return res.status(HttpStatusCode.OK).json(todos)
      } catch (err) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      }

    case 'POST':
      try {
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

        const createdTodo = getDataWithId<ITodo>(newTodoDocSnapshot)

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

        // set variables for the result
        let successfull = [] as IDeleteTodosResult['successfull']
        let failed = [] as IDeleteTodosResult['failed']

        // delete Todo for each ids
        for (const id of ids) {
          try {
            // delete from DB
            await firestore.collection('todos').doc(id).delete()

            // add to successful array
            successfull = [...successfull, id]
          } catch (err) {
            console.error('ERROR', err)
            // add to failed array
            failed = [...failed, { id, reason: err.message }]
          }
        }

        const isBadRequest: boolean = failed.length > 0

        return res
          .status(
            isBadRequest ? HttpStatusCode.MULTI_STATUS : HttpStatusCode.OK
          )
          .json({ successfull, failed } as IDeleteTodosResult)
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

export interface IDeleteTodosResult {
  successfull: ITodo['id'][]
  failed: IFailedTodo[]
}
interface IFailedTodo {
  id: ITodo['id']
  reason: string
}
