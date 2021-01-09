import _ from 'lodash'
import { ITodo, ITodoStatusEnum } from '../utils/interfaces/todos'
import firebase from 'firebase/app'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'

interface Props {
  initialData?: ITodo[]
  filter?: ITodoStatusEnum
}
interface IUseTodosResult {
  todos: ITodo[]
  error?: Error
  createTodo: (newTodo: Partial<ITodo>) => void
  updateTodo: (id: ITodo['id'], update: Partial<ITodo>) => void
  deleteTodo: (id: ITodo['id']) => void
  clearCompleted: () => void
  todosLeft: number
}

export default function useTodos({
  initialData,
  filter,
}: Props = {}): IUseTodosResult {
  // initiate Firebase
  const FIRESTORE = useFirestore()
  const firestoreServerTimeStamp = useFirestore.FieldValue.serverTimestamp()

  // get the query
  const query = filter
    ? getQuery({
        firestore: FIRESTORE,
        collectionPath: 'todos',
        whereFilterOptions: getWHereFilterOptions(filter),
      })
    : getQuery({ firestore: FIRESTORE, collectionPath: 'todos' })

  // get the data from the DB
  const { data: todos, error } = useFirestoreCollectionData<ITodo>(query, {
    initialData,
    idField: 'id',
  })

  //
  let ERROR: Error | undefined = error

  // CRUD functions
  async function createTodo(newTodo: Partial<ITodo>): Promise<void> {
    await FIRESTORE.collection('todos').add({
      ...newTodo,
      created: firestoreServerTimeStamp,
    })
  }

  async function updateTodo(
    id: ITodo['id'],
    update: Partial<ITodo>
  ): Promise<void> {
    console.log('useTodos - updateTodo', update)
    await FIRESTORE.collection('todos').doc(id).update(update)
  }

  async function deleteTodo(id: ITodo['id']): Promise<void> {
    await FIRESTORE.collection('todos').doc(id).delete()
  }

  async function clearCompleted(): Promise<void> {
    // create the query
    const query = await FIRESTORE.collection('todos').where(
      'completed',
      '==',
      true
    )
    // get the snapshot
    const snapshot = await query.get()
    // create a batch
    const batch = FIRESTORE.batch()
    // delete documents
    snapshot.docs.forEach((doc) => batch.delete(doc.ref))
    // commit the batch
    await batch.commit()
  }

  // helper functions
  type GetWhereFilterOptionsResult = [
    string | firebase.firestore.FieldPath,
    firebase.firestore.WhereFilterOp,
    any
  ]

  function getWHereFilterOptions(
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

  interface GetQueryProps {
    firestore: firebase.firestore.Firestore
    whereFilterOptions?: GetWhereFilterOptionsResult
    collectionPath: string
  }

  function getQuery({
    firestore,
    collectionPath,
    whereFilterOptions,
  }: GetQueryProps) {
    if (whereFilterOptions) {
      return firestore.collection(collectionPath).where(...whereFilterOptions)
    } else {
      return firestore.collection(collectionPath)
    }
  }

  return {
    todos,
    error: ERROR,
    createTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    todosLeft:
      todos && todos.length > 0
        ? todos.filter((todo) => !todo.completed).length
        : 0,
  }
}
