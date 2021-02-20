import CompleteTodoRoundCheckbox from './RoundCheckbox'
import Textbox from './Textbox'
import React, { Fragment } from 'react'
import { ITodo } from '../utils/interfaces/todos'
import useTodos from '../hooks/useTodos'
import Skeleton from 'react-loading-skeleton'
import SkeletonThemeWrapper from './SkeletonThemeWrapper'
import DeleteTodoIconButton from './IconButton'
import ThreeDots from './ThreeDots'
import firebase from 'firebase/app'

interface Props {
  placeholder?: string
  todo?: ITodo
}

export default function Todo({ todo, placeholder }: Props) {
  const { updateTodo, deleteTodo } = useTodos()

  // handlers
  const handleChangeTitle = (title: string): void => {
    if (!title) {
      // log analytics event
      firebase
        .analytics()
        .logEvent('deleted_todo_by_changing_title_to_empty_string', {
          todoId: todo!.id,
          todoTitleBefore: todo!.title,
          todoTitleAfter: title,
        })
      // delete the todo
      deleteTodo(todo!.id)
    } else {
      // log analytics event
      firebase.analytics().logEvent('changed_todo_title', {
        todoId: todo!.id,
        todoTitleBefore: todo!.title,
        todoTitleAfter: title,
      })
      // update the todo
      updateTodo(todo!.id, { ...todo, title })
    }
  }

  const handleToggleCompleted = (completed: boolean): void => {
    // log analytics event
    firebase.analytics().logEvent('toggled_todo_completed', {
      todoId: todo!.id,
      todoCompletedBefore: todo!.completed,
      todoCompletedAfter: completed,
    })
    // update the todo
    updateTodo(todo!.id, { completed })
  }

  const handleDelete = (id: ITodo['id']): void => {
    // log analytics event
    firebase.analytics().logEvent('deleted_todo', {
      todoId: id,
    })
    // delete the todo
    deleteTodo(id)
  }

  return (
    <div
      id={todo?.id || 'loadig-todo'}
      className={`flex w-full h-full justify-center items-center p-2 bg-light-0 dark:bg-dark-1 rounded-md`}
      tabIndex={0}
    >
      {/* loading completed checkbox state*/}
      {!todo && (
        <div className="p-2">
          <Skeleton
            wrapper={SkeletonThemeWrapper}
            circle
            width="1.5rem"
            height="1.5rem"
          />
        </div>
      )}
      {todo && (
        <Fragment>
          <ThreeDots orientation="vertical" />
          <CompleteTodoRoundCheckbox
            id={todo.id}
            checked={todo.completed || false}
            onToggle={handleToggleCompleted}
          />
        </Fragment>
      )}
      {!todo && (
        <div className="h-full w-full pl-4">
          <Skeleton wrapper={SkeletonThemeWrapper} />
        </div>
      )}
      {todo && (
        <Textbox
          value={todo.title}
          placeholder={placeholder || 'Add a title'}
          onChange={handleChangeTitle}
          onSubmit={handleChangeTitle}
          debounceDelay={1000}
          submitOnEnterKey
          submitOnBlur
        />
      )}
      {/* delete Todo button */}
      {todo && (
        <DeleteTodoIconButton
          alt="Delete Todo"
          src="/icons/icon-cross.svg"
          size="md"
          onClick={() => handleDelete(todo.id)}
          focusable
        />
      )}
    </div>
  )
}
