import { CloseIcon, DragHandleIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useColorModeValue,
} from '@chakra-ui/react'
import firebase from 'firebase/app'
import React from 'react'
import useTodos from '../hooks/useTodos'
import { ITodo } from '../utils/interfaces/todo'
import RoundCheckbox from './RoundCheckbox'
import Textbox from './Textbox'

interface Props {
  todo: ITodo
  placeholder?: string
  isDragging?: boolean
}

export default function Todo({ todo, placeholder, isDragging = false }: Props) {
  const { updateTodo, deleteTodo } = useTodos()

  const iconColor = useColorModeValue('secondary.light', 'secondary.dark')

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
    <Flex
      id={todo?.id || 'loading-todo'}
      p="2"
      justifyContent="space-between"
      shadow={isDragging ? 'dark-lg' : undefined}
      style={{
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(5rem)',
      }}
    >
      <InputGroup size="lg" alignItems="center">
        <InputLeftAddon
          background="transparent"
          padding="0"
          border="none"
          color={iconColor}
          children={<DragHandleIcon />}
        />
        <InputLeftAddon
          background="transparent"
          border="none"
          padding="0"
          children={
            <RoundCheckbox
              id={todo.id}
              checked={todo.completed || false}
              onToggle={handleToggleCompleted}
            />
          }
        />
        <Textbox
          value={todo.title}
          placeholder={placeholder || 'Add a title'}
          onChange={handleChangeTitle}
          onSubmit={handleChangeTitle}
          debounceDelay={1000}
          submitOnEnterKey
          submitOnBlur
        />
        <InputRightAddon
          background="transparent"
          border="none"
          children={
            <IconButton
              aria-label="Clear Text"
              size="md"
              variant="ghost"
              onClick={() => handleDelete(todo.id)}
              isRound
              color={iconColor}
              icon={<CloseIcon />}
            />
          }
        />
      </InputGroup>
    </Flex>
  )
}
