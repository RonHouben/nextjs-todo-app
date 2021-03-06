import { useToast } from '@chakra-ui/toast'
import firebase from 'firebase/app'
import { useAuthUser } from 'next-firebase-auth'
import type { ITodo } from '../utils/interfaces/todo'
import { ITodoStatusEnum } from '../utils/interfaces/todo'

type GetWhereFilterOptionsResult = [
  string | firebase.firestore.FieldPath,
  firebase.firestore.WhereFilterOp,
  any
]

export default function useTodos() {
  const { id: uid } = useAuthUser()
  const toast = useToast({ position: 'top-right', isClosable: true })

  function getTodosQuery(filter: ITodoStatusEnum) {
    if (firebase.apps.length === 0 && !uid) return

    const baseQuery = firebase
      .firestore()
      .collection(`users/${uid}/todos`)
      .orderBy('order')

    switch (filter) {
      case ITodoStatusEnum.ALL:
        return baseQuery
      case ITodoStatusEnum.ACTIVE:
        return baseQuery.where('completed', '==', false)
      case ITodoStatusEnum.COMPLETED:
        return baseQuery.where('completed', '==', true)
    }
  }

  async function createTodo(
    uid: string,
    newTodo: Partial<ITodo>
  ): Promise<void> {
    try {
      if (!uid)
        throw new Error(
          'please specify a userId when initializing the useTodos hook'
        )

      // get existing todo id's from the user data
      const snapshot = await firebase
        .firestore()
        .collection(`/users/${uid}/todos`)
        .get()

      // create the todo
      await firebase
        .firestore()
        .collection(`/users/${uid}/todos`)
        .add({
          ...newTodo,
          order: snapshot.size || 0,
          createdAt: firebase.firestore.Timestamp.now(),
          updatedAt: firebase.firestore.Timestamp.now(),
        } as ITodo)

      toast({ status: 'success', description: `Created "${newTodo.title}"` })
    } catch (error) {
      console.error('[useTodos][createTodo]', error.message)
      toast({ status: 'error', description: error.message })
    }
  }

  async function updateTodo(
    id: ITodo['id'],
    update: Partial<ITodo>
  ): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection(`users/${uid}/todos`)
        .doc(id)
        .update({
          ...update,
          updatedAt: firebase.firestore.Timestamp.now(),
        })
      toast({
        status: 'success',
        title: 'updated todo',
        description: `updated todo`,
      })
    } catch (error) {
      console.error('[useTodos][updateTodo]', error.message)
      toast({ status: 'error', description: error.message })
    }
  }

  async function deleteTodo(id: ITodo['id']): Promise<void> {
    try {
      const snapshotTodo = await firebase
        .firestore()
        .collection(`users/${uid}/todos`)
        .doc(id)
        .get()

      const data = snapshotTodo.data() as ITodo

      await snapshotTodo.ref.delete()

      toast({ status: 'success', description: `Deleted "${data.title}` })
    } catch (error) {
      console.error('[useTodos][deleteTod]', error.message)
      toast({ status: 'error', description: error.message })
    }
  }

  // TODO: implement more efficient ordering
  async function reorderTodos(ids: ITodo['id'][]) {
    try {
      await Promise.all(
        ids.map(async (id, i) => {
          await firebase
            .firestore()
            .collection(`users/${uid}/todos`)
            .doc(id)
            .update({ order: i })
        })
      )

      toast({ status: 'success', description: 'changed the order' })
    } catch (error) {
      console.error('[useTodos][reorderTodos]', error.message)
      toast({ status: 'error', description: error.message })
    }
  }

  // helper functions
  function getWhereFilterOptions(
    filter: ITodoStatusEnum
  ): GetWhereFilterOptionsResult | undefined {
    switch (filter) {
      case ITodoStatusEnum.ACTIVE:
        return ['completed', '!=', true]
      case ITodoStatusEnum.COMPLETED:
        return ['completed', '==', true]
      default:
        return undefined
    }
  }

  return {
    getTodosQuery,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    getWhereFilterOptions,
  }
}
