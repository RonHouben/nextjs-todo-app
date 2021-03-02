import { CloseIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useColorModeValue,
} from '@chakra-ui/react'
import firebase from 'firebase/app'
import { useAuthUser } from 'next-firebase-auth'
import React, { useState } from 'react'
import useTodos from '../hooks/useTodos'
import { ITodo } from '../utils/interfaces/todo'
import { default as RoundCheckbox } from './RoundCheckbox'
import Textbox from './Textbox'

interface Props {
  autoFocus?: boolean
}

export default function CreateTodo({ autoFocus = false }: Props) {
  // getUser from session
  const { id: userId } = useAuthUser()
  // set local completed state
  const [completed, setCompleted] = useState<boolean>(false)
  // set local title state
  const [title, setTitle] = useState<ITodo['title']>()

  // hooks
  const { createTodo } = useTodos()
  const iconColor = useColorModeValue('secondary.light', 'secondary.dark')

  // handlers
  const handleToggleCompleted = (checked: boolean) => {
    // log analytics event
    firebase.analytics().logEvent('toggled_new_todo_completed', {
      todoCompleted: checked,
      todoTitle: title,
    })
    // set local state
    setCompleted(checked)
  }

  const handleChangeTitle = (newTitle: ITodo['title']) => {
    // log analytics event
    firebase.analytics().logEvent('changed_new_todo_title', {
      todoTitle: title,
    })
    // set local state
    setTitle(newTitle)
  }

  const handleSubmitTodo = (title: ITodo['title']) => {
    // log analytics event
    firebase.analytics().logEvent('submitted_new_todo', {
      todoUserId: userId,
      todoTitle: title,
      todoCompleted: completed,
    })
    // add to db
    if (userId) {
      createTodo(userId, { title, completed })
      // update local states
      setTitle('')
      setCompleted(false)
    }
  }

  const handleClearTodo = () => {
    // log analytics event
    firebase.analytics().logEvent('cleared_new_todo_title', {
      todoTitle: title,
    })
    // set local states
    setTitle('')
    setCompleted(false)
  }

  return (
    <Flex id="create-todo" p="2" justifyContent="space-between">
      <InputGroup size="lg" alignItems="center">
        <InputLeftAddon
          background="transparent"
          border="none"
          paddingLeft="17px"
          paddingRight="0"
          children={
            <RoundCheckbox
              id="create-todo-checkbox"
              checked={completed}
              onToggle={handleToggleCompleted}
            />
          }
        />
        <Textbox
          value={title || ''}
          placeholder="Create a new todo..."
          onChange={handleChangeTitle}
          onSubmit={handleSubmitTodo}
          debounceDelay={0}
          autoFocus={autoFocus}
          submitOnEnterKey
          clearOnEnterKey
        />
        <InputRightAddon
          background="transparent"
          border="none"
          children={
            <IconButton
              aria-label="Clear Text"
              size="md"
              variant="ghost"
              onClick={handleClearTodo}
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
