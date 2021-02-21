import { NextApiRequest, NextApiResponse } from 'next'
import firebaseAdmin from '../../../lib/firebaseAdmin'
import HTTPMethod from '../../../utils/interfaces/HttpMethods.enum'
import HttpStatusCode from '../../../utils/interfaces/HttpStatusCodes.enum'
import { ITodo } from '../../../utils/interfaces/todo'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get update from the request body
  const id = req.query.id as ITodo['id']
  const body: Partial<ITodo> = req.body

  const { firestore, getDataWithId } = firebaseAdmin()

  // Get data from your database
  switch (req.method) {
    case HTTPMethod.GET:
      if (!id) {
        return res.status(HttpStatusCode.BAD_GATEWAY).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
      }

      try {
        const docSnapshot = await firestore.collection('todos').doc(id).get()

        return res
          .status(HttpStatusCode.OK)
          .json(getDataWithId<ITodo>(docSnapshot))
      } catch (err) {
        console.error(err)

        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            message: err.message,
          },
        })
      }

    case HTTPMethod.PATCH:
      if (!id) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
      }

      try {
        // get the firebase todos collection
        const collection = firestore.collection('todos')
        // update the document
        await collection.doc(id).update(body)
        // get the updated snapshot
        const updatedTodoSnapshot = await collection.doc(id).get()
        // return the response
        return res
          .status(HttpStatusCode.OK)
          .json(getDataWithId<ITodo>(updatedTodoSnapshot))
      } catch (err) {
        return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: {
            message: err.message,
          },
        })
      }

    case HTTPMethod.DELETE:
      if (!id) {
        return res.status(HttpStatusCode.BAD_GATEWAY).json({
          error: {
            message: `Couldn't find Todo with id: ${id}`,
          },
        })
      }

      try {
        const docRef = firestore.collection('todos').doc(id)
        await docRef.delete()

        return res.status(HttpStatusCode.NO_CONTENT).json({})
      } catch (err) {
        console.error(err.message)

        return res.status(HttpStatusCode.BAD_REQUEST).json({
          error: {
            message: err.message,
          },
        })
      }

    default:
      const errorMessage = `${req.method} is not allowed`

      console.error(errorMessage)

      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
        error: {
          message: errorMessage,
        },
      })
  }
}
