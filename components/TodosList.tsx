import React, { Fragment } from "react";
import { ITodo } from "../utils/interfaces/todos";
import Todo from "./Todo";
import { Draggable, Droppable } from "react-beautiful-dnd";
interface Props {
  todos: ITodo[];
}
export default function TodosList({ todos }: Props) {
  return (
    <Fragment>
      <Droppable droppableId="todo-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {todos.length > 0 &&
              todos.map((todo, i) => (
                <Draggable key={todo.id} draggableId={todo.id} index={i}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Todo key={i} todo={todo} />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Fragment>
  );
}
