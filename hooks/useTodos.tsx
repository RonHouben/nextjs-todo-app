import _ from 'lodash'
import useSWR, { mutate } from 'swr'
import { ITodo, ITodoStatusEnum } from '../interfaces/todos'
import { IDeleteTodosResult } from '../pages/api/todos'
import { fetcher, FetchError } from '../utils/fetcher'
import { serverValueTimestamp } from '../utils/firebase'

interface IUseTodoProps {
  initialData?: ITodo[]
}

interface IUseTodosResult {
  todos: ITodo[] | undefined
  itemsLeft: number
  error?: FetchError
  createTodo: (newTodo: Partial<ITodo>) => void
  updateTodo: (id: ITodo['id'], update: Partial<ITodo>) => void
  deleteTodo: (id: ITodo['id']) => void
  clearCompleted: () => void
  filterByStatus: (todoStatus: ITodoStatusEnum) => ITodo[]
}

export default function useTodos({
  initialData,
}: IUseTodoProps = {}): IUseTodosResult {
  const TODOS_URI = `/api/todos`

  const { data: todos, error: useSWRError } = useSWR<ITodo[], FetchError>(
    TODOS_URI,
    fetcher,
    { initialData }
  )

  let ERROR: FetchError | undefined = useSWRError

  async function createTodo(newTodo: Partial<ITodo>): Promise<void> {
    // append default data
    const newTodoWithDefaults = {
      ...newTodo,
      created: serverValueTimestamp,
      completed: false,
    } as ITodo
    // optimistically update local state
    mutate(
      TODOS_URI,
      todos ? [...todos, newTodoWithDefaults] : [newTodoWithDefaults],
      false
    )

    async function createTodo(newTodo: ITodo) {
      // create new Todo in database
      try {
        await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        })
      } catch (err) {
        console.error(err)
        ERROR = err as FetchError
      }
    }
    // revalidate after db call
    mutate(TODOS_URI, createTodo(newTodoWithDefaults))
  }

  async function updateTodo(
    id: ITodo['id'],
    update: Partial<ITodo>
  ): Promise<void> {
    // optimistically update local state
    mutate(
      TODOS_URI,
      todos
        ? todos.map((todo) => (todo.id === id ? { ...todo, ...update } : todo))
        : todos,
      false
    )

    // call changeTodo api in backend
    try {
      await fetch(`${TODOS_URI}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      })
      // revalidate after db call
      mutate(`${TODOS_URI}/${id}`)
      mutate(TODOS_URI)
    } catch (err) {
      console.error(err)
      ERROR = err as FetchError
    }
  }

  async function deleteTodo(id: ITodo['id']): Promise<void> {
    // optimistically update local state
    mutate(
      TODOS_URI,
      todos ? todos.filter((todo) => todo.id !== id) : todos,
      false
    )
    // delete the todo in backend
    try {
      await fetch(`${TODOS_URI}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      console.error(err)
      ERROR = err as FetchError
    }
    // revalidate after db call
    mutate(TODOS_URI)
  }

  async function clearCompleted(): Promise<void> {
    // optimistically update local state
    mutate(TODOS_URI, filterByStatus(ITodoStatusEnum.ACTIVE))
    // get id's from the completed todos
    const completedTodosIds = filterByStatus(ITodoStatusEnum.COMPLETED).map(
      (a) => a.id
    )
    // remove all completed todos from the DB
    const response = await fetch(
      `/api/todos?ids=${JSON.stringify(completedTodosIds)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // get result from the response
    const { failed } = (await response.json()) as IDeleteTodosResult

    // show notification for the failed todo's
    if (failed.length > 0) {
      // TODO: implement
      console.error(
        'Something went wrong with deleting the following todos:',
        failed
      )
    }

    // revalidate
    mutate(TODOS_URI)
  }

  function filterByStatus(status: ITodoStatusEnum): ITodo[] {
    switch (status) {
      case ITodoStatusEnum.ALL:
        return todos || []
      case ITodoStatusEnum.ACTIVE:
        return todos?.filter((todo) => !todo.completed) || []
      case ITodoStatusEnum.COMPLETED:
        return todos?.filter((todo) => todo.completed) || []
    }
  }

  return {
    todos,
    error: ERROR,
    createTodo,
    updateTodo,
    deleteTodo,
    itemsLeft: todos?.filter((todo) => !todo.completed).length || 0,
    filterByStatus,
    clearCompleted,
  }
}
