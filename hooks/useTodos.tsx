import _ from 'lodash'
import useSWR, { mutate } from 'swr'
import { ITodo } from '../interfaces/todos'
import { fetcher, FetchError } from '../utils/fetcher'

export enum TodoStatusEnum {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

interface IUseTodos {
  todos: ITodo[] | undefined
  itemsLeft: number
  error?: FetchError
  createTodo: (newTodo: Partial<ITodo>) => void
  updateTodo: (id: ITodo['id'], update: Partial<ITodo>) => void
  deleteTodo: (id: ITodo['id']) => void
  clearCompleted: () => void
  filterByStatus: (todoStatus: TodoStatusEnum) => ITodo[]
}

export default function useTodos(): IUseTodos {
  const TODOS_URI = `/api/todos`

  const { data: todos, error: useSWRError } = useSWR<ITodo[], FetchError>(
    TODOS_URI,
    fetcher
  )

  let ERROR: FetchError | undefined = useSWRError

  async function createTodo(newTodo: Partial<ITodo>): Promise<void> {
    // append default data
    const newTodoWithDefaults = {
      created: new Date(),
      completed: false,
      ...newTodo,
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
        method: 'PUT',
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
    mutate(TODOS_URI, filterByStatus(TodoStatusEnum.ACTIVE))
    mutate(TODOS_URI)
  }

  function filterByStatus(status: TodoStatusEnum): ITodo[] {
    switch (status) {
      case TodoStatusEnum.ALL:
        return todos || []
      case TodoStatusEnum.ACTIVE:
        return todos?.filter((todo) => !todo.completed) || []
      case TodoStatusEnum.COMPLETED:
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
