import firebase from 'firebase/app'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { toast } from 'react-toastify'
import type { ITodo } from '../utils/interfaces/todo'
import { ITodoStatusEnum } from '../utils/interfaces/todo'
import type { IUser } from '../utils/interfaces/user'

type GetWhereFilterOptionsResult = [
  string | firebase.firestore.FieldPath,
  firebase.firestore.WhereFilterOp,
  any
]
interface GetTodosProps {
  filter?: ITodoStatusEnum
  userId: string
}

interface GetQueryProps {
  whereFilterOptions?: GetWhereFilterOptionsResult
  collectionPath: string
  userId?: string
}

export default function useTodos() {
  function getTodos({ filter, userId }: GetTodosProps) {
    // get the query
    const query = filter
      ? getQuery({
          collectionPath: 'todos',
          whereFilterOptions: getWhereFilterOptions(filter),
          userId,
        })
      : getQuery({ collectionPath: 'todos', userId }).orderBy('order')

    const [todos, loading, error] = useCollectionData<ITodo>(query, {
      idField: 'id',
    })

    if (error) {
      console.error('[useTodos][getTodos]', error.message)
      toast.error(error.message)
    }

    return { todos, loading, error }
  }

  async function createTodo(
    userId: string,
    newTodo: Partial<ITodo>
  ): Promise<void> {
    try {
      if (!userId)
        throw new Error(
          'please specify a userId when initializing the useTodos hook'
        )

      // create the todo
      const { id: newTodoId } = await firebase
        .firestore()
        .collection('todos')
        .add({
          ...newTodo,
          userId,
          createdAt: firebase.firestore.Timestamp.now(),
          updatedAt: firebase.firestore.Timestamp.now(),
          order: 0,
        } as ITodo)

      // add todo ID to the users todos array
      const user = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .get()

      // get existing todo id's from the user data
      const { todos: existingTodosIds } = user.data() as IUser
      // append the newTodoId to the todos array
      user.ref.update({
        todos: [...existingTodosIds, newTodoId],
      })

      toast(`Created "${newTodo.title}"`, {
        type: 'success',
      })
    } catch (error) {
      console.error('[useTodos][createTodo]', error.message)
      toast(error.message, { type: 'error' })
    }
  }

  async function updateTodo(
    id: ITodo['id'],
    update: Partial<ITodo>
  ): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection('todos')
        .doc(id)
        .update({
          ...update,
          updatedAt: firebase.firestore.Timestamp.now(),
        })
    } catch (error) {
      console.error('[useTodos][updateTodo]', error.message)
      toast.error(error.message)
    }
  }

  async function deleteTodo(id: ITodo['id']): Promise<void> {
    try {
      const snapshot = await firebase
        .firestore()
        .collection('todos')
        .doc(id)
        .get()
      const data = snapshot.data() as ITodo

      await snapshot.ref.delete()

      toast(`Deleted "${data.title}`, { type: 'success' })
    } catch (error) {
      console.error('[useTodos][deleteTod]', error.message)
      toast.error(error.message)
    }
  }

  // TODO: implement more efficient ordering
  async function reorderTodos(ids: ITodo['id'][]) {
    try {
      await Promise.all(
        ids.map(async (id, i) => {
          await firebase
            .firestore()
            .collection('todos')
            .doc(id)
            .update({ order: i })
        })
      )
    } catch (error) {
      console.error('[useTodos][reorderTodos]', error.message)
      toast.error(error.message)
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

  function getQuery({
    collectionPath,
    whereFilterOptions,
    userId,
  }: GetQueryProps) {
    if (userId && whereFilterOptions) {
      return firebase
        .firestore()
        .collection(collectionPath)
        .where(...whereFilterOptions)
        .where('userId', '==', userId)
    } else if (!userId && whereFilterOptions) {
      return firebase
        .firestore()
        .collection(collectionPath)
        .where(...whereFilterOptions)
    } else if (userId && !whereFilterOptions) {
      return firebase
        .firestore()
        .collection(collectionPath)
        .where('userId', '==', userId)
    } else {
      return firebase.firestore().collection(collectionPath)
    }
  }

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    getWhereFilterOptions,
    getQuery,
  }
}
