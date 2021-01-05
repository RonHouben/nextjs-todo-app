import RoundCheckbox from './RoundCheckbox'
import Textbox from './Textbox'
import React, { useEffect, useState } from 'react'
import { ITodo } from '../interfaces/todos'
import Image from 'next/image'
import useTodos from '../hooks/useTodos'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useTheme } from 'next-themes'

interface Props {
  placeholder?: string
  todoData?: ITodo
  createNewTodo?: boolean
  autoFocus?: boolean
  divider?: boolean
}

export default function Todo({
  todoData,
  placeholder,
  createNewTodo = false,
  autoFocus = false,
  divider = false,
}: Props) {
  const [todo, setTodo] = useState<ITodo | undefined>(todoData)
  const { createTodo, updateTodo, deleteTodo } = useTodos()
  const [focus, setFocus] = useState<boolean>(false)
  const { theme } = useTheme()

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
      className={`${
        divider
          ? 'border-b-2 border-light-2 dark:border-dark-6 border-opacity-20'
          : ''
      } flex w-full h-full justify-center items-center bg-light-0 dark:bg-dark-1`}
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      {!todo && !createNewTodo ? (
        <div className='p-2 '>
          <SkeletonTheme>
            <Skeleton circle width='1.5rem' height='1.5rem' />
          </SkeletonTheme>
        </div>
      ) : (
        <RoundCheckbox
          id={createNewTodo ? 'new-todo' : todo?.id || 'loading'}
          checked={todo?.completed || false}
          onChange={handleToggleCompleted}
        />
      )}
      {!todo?.title && !createNewTodo ? (
        <div className='h-full w-full'>
          <SkeletonTheme color={theme}>
            <Skeleton />
          </SkeletonTheme>
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
      <div
        className={`${
          !focus || createNewTodo ? 'invisible' : 'visible'
        } relative w-5 h-5 m-2 cursor-pointer`}
        onClick={() => handleDelete(todo!.id)}
        onKeyPress={() => handleDelete(todo!.id)}
        tabIndex={0}
      >
        {focus && !createNewTodo && (
          <Image layout='fill' src='/images/icon-cross.svg' />
        )}
      </div>
    </div>
  )
}
