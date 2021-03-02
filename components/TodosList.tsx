import { Box } from '@chakra-ui/react'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd'
import { ITodo } from '../utils/interfaces/todo'
import Todo from './Todo'
interface Props {
  onDragEnd: (result: DropResult, _provided: ResponderProvided) => void
  todos: ITodo[]
}
export default function TodosList({ todos, onDragEnd }: Props) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {todos.length > 0 &&
              todos.map((todo, i) => (
                <Draggable key={todo.id} draggableId={todo.id} index={i}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Todo
                        key={i}
                        todo={todo}
                        isDragging={snapshot.isDragging}
                      />
                    </Box>
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
