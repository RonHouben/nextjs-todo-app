import { NextApiRequest, NextApiResponse } from 'next'
import { ITodo } from '../../../utils/interfaces/todos'
import HttpStatusCode from '../../../utils/interfaces/HttpStatusCodes.enum'
import firebase from '../../../lib/firebase'
import HTTPMethod from '../../../utils/interfaces/HttpMethods.enum'

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
      if (!id) {
        res.status(HttpStatusCode.BAD_GATEWAY).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
        return
      }

      try {
        const docRef = firebase.collection('todos').doc(id)
        const docSnapshot = await docRef.get()
        const todoData = docSnapshot.data() as ITodo

        const todo = { id: docSnapshot.id, ...todoData }

        res.status(HttpStatusCode.OK).json(todo)
        return
      } catch (err) {
        console.error(err)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            message: err.message,
          },
        })
        return
      }
    case HTTPMethod.PATCH:
      if (!id) {
        res.status(HttpStatusCode.BAD_GATEWAY).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
        return
      }

      try {
        const docRef = firebase.collection('todos').doc(id)
        await docRef.update(body)

        const updatedTodoSnapshot = await docRef.get()
        const updatedTodoData = updatedTodoSnapshot.data() as ITodo

        const updatedTodo = { ...updatedTodoData, id: updatedTodoSnapshot.id }

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
      if (!id) {
        res.status(HttpStatusCode.BAD_GATEWAY).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
        return
      }

      try {
        const docRef = firebase.collection('todos').doc(id)
        await docRef.delete()

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
