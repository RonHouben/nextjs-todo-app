import firebase from 'firebase/app'
import { AuthAction, useAuthUser, withAuthUser } from 'next-firebase-auth'
import React, { useEffect, useState } from 'react'
import { DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import CreateTodo from '../components/CreateTodo'
import Filterbar from '../components/Filterbar'
import Layout from '../components/Layout'
import LoadingScreen from '../components/LoadingScreen'
import Paper from '../components/Paper'
import TodosList from '../components/TodosList'
import useFirebaseCloudMessaging from '../hooks/useFirebaseCloudMessaging'
import useTodos from '../hooks/useTodos'
import { reorder } from '../utils/arrays'
import { ITodo, ITodoStatusEnum } from '../utils/interfaces/todo'
import registerToastServiceWorker from '../utils/registerToastServiceWorker'

// This shows a toast on service worker lifecycle changes
registerToastServiceWorker()

interface Props {}

function TodoApp({}: Props) {
  const { id: uid } = useAuthUser()

  // set the userId for Firebase Analytics
  useEffect(() => {
    if (uid) {
      firebase.analytics().setUserId(uid)
      firebase.analytics().setCurrentScreen('home_screen')
    }
  }, [uid])

  // this shows a toast when a foreground message arrives from Firebase Cloud Messsaging
  useFirebaseCloudMessaging()

  // get todo functions
  const { deleteTodo, reorderTodos, getTodosQuery } = useTodos()
  // selectedFilter state for the filterbar
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  )

  // get the todos from the database
  const query = getTodosQuery<ITodo>(selectedFilter)

  const [todos, loading] = useCollectionData<ITodo>(query, {
    idField: 'id',
  })

  // handlers
  const handleClearCompleted = () => {
    // get all completed todos
    const completedTodos = todos?.filter((todo) => todo.completed) || []
    // remove each complete todo
    completedTodos.forEach(async ({ id }) => deleteTodo(id))
    // log analytics event
    firebase.analytics().logEvent('cleared_completed', {
      todos: completedTodos.map((todo) => todo.id),
    })
  }

  const handleChangeFilter = (newFilter: ITodoStatusEnum) => {
    // log analytics event
    firebase.analytics().logEvent('changed_todos_filter', {
      before: selectedFilter,
      after: newFilter,
    })
    // setSelectedFilter local state
    setSelectedFilter(newFilter)
  }

  const handleDragEnd = (result: DropResult, _provided: ResponderProvided) => {
    const { source, destination } = result
    // dropped outside list
    if (!destination || destination.index === source.index) {
      return
    }

    const reorderedTodos = reorder<ITodo>({
      array: todos || [],
      sourceIndex: source.index,
      destinationIndex: destination.index,
    })

    const reorderedTodoIds = reorderedTodos.map(({ id }) => id)
    // save new order in the database
    reorderTodos(reorderedTodoIds)
    // log analytics event
    firebase.analytics().logEvent('changed_todos_order', {
      before: todos?.map(({ id }) => id) || [],
      after: reorderedTodoIds,
    })
  }

  return (
    <Layout>
      {!uid && <LoadingScreen />}
      {uid && (
        <Paper rounded shadow>
          <CreateTodo autoFocus />
          {!loading && todos && (
            <TodosList todos={todos} onDragEnd={handleDragEnd} />
          )}
          <Filterbar
            itemsLeft={todos?.length || 0}
            filters={[
              ITodoStatusEnum.ALL,
              ITodoStatusEnum.ACTIVE,
              ITodoStatusEnum.COMPLETED,
            ]}
            selected={selectedFilter}
            onChangeFilter={handleChangeFilter}
            onClearCompleted={handleClearCompleted}
          />
        </Paper>
      )}
    </Layout>
  )
}

export default withAuthUser<Props>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(TodoApp)
