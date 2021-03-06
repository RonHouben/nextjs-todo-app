import { Box } from '@chakra-ui/react'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd'
import ReactDOM from 'react-dom'
import { ITodo } from '../utils/interfaces/todo'
import Todo from './Todo'
interface Props {
  onDragEnd: (result: DropResult, _provided: ResponderProvided) => void
  todos: ITodo[]
}

export default function TodosList({ todos, onDragEnd }: Props) {
  // usage of portal is necessary to render the draggable correctly with backdropFilter
  const portal = document.createElement('div')
  document.body.appendChild(portal)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {todos.length > 0 &&
              todos.map((todo, i) => (
                <Draggable key={todo.id} draggableId={todo.id} index={i}>
                  {(provided, snapshot) => (
                    <PortalAwareTodo
                      provided={provided}
                      snapshot={snapshot}
                      todo={todo}
                      portal={portal}
                    />
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

type PortalAwareItemProps = {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  todo: ITodo
  portal: HTMLElement
}

function PortalAwareTodo({
  provided,
  snapshot,
  todo,
  portal,
}: PortalAwareItemProps) {
  const child = (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Todo todo={todo} isDragging={snapshot.isDragging} />
    </Box>
  )

  if (!snapshot.isDragging) {
    return child
  }
  // if dragging - put the item in a portal
  return ReactDOM.createPortal(child, portal)
}
