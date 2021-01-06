import RoundCheckbox from './RoundCheckbox'
import Textbox from './Textbox'
import React, { useEffect, useState } from 'react'
import { ITodo } from '../interfaces/todos'
import useTodos from '../hooks/useTodos'
import Skeleton from 'react-loading-skeleton'
import SkeletonThemeWrapper from '../utils/SkeletonThemeWrapper'
import IconButton from './IconButton'

interface Props {
  placeholder?: string
  todoData?: ITodo
  createNewTodo?: boolean
  autoFocus?: boolean
}

export default function Todo({
  todoData,
  placeholder,
  createNewTodo = false,
  autoFocus = false,
}: Props) {
  const [todo, setTodo] = useState<ITodo | undefined>(todoData)
  const { createTodo, updateTodo, deleteTodo } = useTodos()
  const [focus, setFocus] = useState<boolean>(false)

  // handlers
  const handleChangeTitle = (id: ITodo['id'], title: string): void => {
    if (createNewTodo) {
      createTodo({ ...todo, title })
    } else if (!title) {
      deleteTodo(id)
    } else {
      updateTodo(id, { ...todo, title })

      // set focus on Todo
      document.getElementById(id || 'new-todo')?.focus()
    }
  }

  const handleToggleCompleted = (id: ITodo['id'], completed: boolean): void => {
    if (id !== 'new-todo') {
      updateTodo(id, { ...todo, completed })
    }
    setTodo((prevTodo) =>
      prevTodo
        ? ({ ...prevTodo, completed: !prevTodo.completed } as ITodo)
        : undefined
    )
  }

  const handleDelete = (id: ITodo['id']): void => {
    deleteTodo(id)
  }

  // update local states
  useEffect(() => {
    setTodo(todoData)
  }, [todoData])

  return (
    <div
      id={createNewTodo ? 'new-todo' : todo?.id}
      className={`flex w-full h-full justify-center items-center p-2 bg-light-0 dark:bg-dark-1`}
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      {!todo && !createNewTodo ? (
        <div className='p-2'>
          <Skeleton
            wrapper={SkeletonThemeWrapper}
            circle
            width='1.5rem'
            height='1.5rem'
          />
        </div>
      ) : (
        <RoundCheckbox
          id={createNewTodo ? 'new-todo' : todo?.id || 'loading'}
          checked={todo?.completed || false}
          onChange={handleToggleCompleted}
        />
      )}
      {!todo?.title && !createNewTodo ? (
        <div className='h-full w-full pl-4'>
          <Skeleton wrapper={SkeletonThemeWrapper} />
        </div>
      ) : (
        <Textbox
          value={todo?.title}
          placeholder={placeholder || 'Add a title'}
          onChange={(newTitle) => handleChangeTitle(todo?.id, newTitle)}
          debounceDelay={2000}
          submitOnEnterKey
          submitOnBlur={!createNewTodo}
          autoFocus={autoFocus}
          clearOnEnterKey={createNewTodo}
        />
      )}
      {/* delete Todo button */}
      {todo && focus && !createNewTodo && (
        <IconButton
          src='/images/icon-cross.svg'
          size='small'
          onClick={() => handleDelete(todo!.id)}
          onKeyPress={() => handleDelete(todo!.id)}
        />
      )}
    </div>
  )
}
