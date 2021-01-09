import React, { Fragment } from 'react'
import { ITodo, ITodoStatusEnum } from '../utils/interfaces/todos'
import Todo from './Todo'

import useTodos from '../hooks/useTodos'
interface Props {
  initialData?: ITodo[]
  filter?: ITodoStatusEnum
}
export default function TodosList({ initialData, filter }: Props) {
  const { todos, error } = useTodos({ initialData, filter })

  return (
    <Fragment>
      {status === 'error' && <div>ERROR {error?.message}</div>}

      {todos.length > 0 &&
        todos.map((todo) => (
          <Todo key={todo.id} id={todo.id} initialData={todo} />
        ))}
    </Fragment>
  )
}
