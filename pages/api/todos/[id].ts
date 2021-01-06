import { NextApiRequest, NextApiResponse } from 'next'
import { ITodo } from '../../../interfaces/todos'
import HttpStatusCode from '../../../interfaces/HttpStatusCodes.enum'
import firebase from '../../../utils/firebase'
import HTTPMethod from '../../../interfaces/HttpMethods.enum'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const id = req.query.id as ITodo['id']
  const body: ITodo = req.body

  // Get data from your database
  switch (req.method) {
    case HTTPMethod.GET:
      try {
        const todo = getTodo(id)

        res.status(HttpStatusCode.OK).json(todo)
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
    case HTTPMethod.PATCH:
      try {
        const updatedTodo = await updateTodo(id, body)

        res.status(HttpStatusCode.OK).json(updatedTodo)
        return
      } catch (err) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            message: err.message,
          },
        })
        return
      }
    case HTTPMethod.DELETE:
      try {
        await deleteTodo(id)
        res.status(HttpStatusCode.NO_CONTENT).json({})
        return
      } catch (err) {
        console.error(err.message)

        res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: err.message,
          },
        })
        return
      }
    default:
      const errorMessage = `${req.method} is not allowed`

      console.error(errorMessage)

      res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
        error: {
          message: errorMessage,
        },
      })
      return
  }
}

async function getTodo(id: ITodo['id']): Promise<ITodo> {
  const docRef = firebase.collection('todos').doc(id)
  const docSnapshot = await docRef.get()
  const todoData = docSnapshot.data() as ITodo

  return { id: docSnapshot.id, ...todoData }
}

async function deleteTodo(id: ITodo['id']): Promise<void> {
  const docRef = firebase.collection('todos').doc(id)
  await docRef.delete()
}

async function updateTodo(
  id: ITodo['id'],
  update: Partial<ITodo>
): Promise<ITodo> {
  try {
    const docRef = firebase.collection('todos').doc(id)
    await docRef.update(update)

    const updatedTodoSnapshot = await docRef.get()
    const updatedTodoData = updatedTodoSnapshot.data() as ITodo

    return { ...updatedTodoData, id: updatedTodoSnapshot.id }
  } catch (error) {
    throw new Error(`Couldn't find Todo with id: ${id} ${error.message}`)
  }
}
