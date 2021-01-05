import React, { useEffect, useState } from 'react'
import Filterbar from '../components/Filterbar'
import Layout from '../components/Layout'
import Todo from '../components/Todo'
import useTodos, { TodoStatusEnum } from '../hooks/useTodos'
import { ITodo } from '../interfaces/todos'

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<TodoStatusEnum>(
    TodoStatusEnum.ALL
  )
  const { todos, error, itemsLeft, filterByStatus, clearCompleted } = useTodos()
  const [filteredTodos, setFilteredTodos] = useState<ITodo[] | undefined>(todos)

  if (error) return <div>ERROR! {error.message}</div>

  // apply filter when selectedFilter or todos change
  useEffect(() => {
    setFilteredTodos(filterByStatus(selectedFilter))
  }, [selectedFilter, todos])

  return (
    <Layout pageTitle='TODO'>
      <div className='flex flex-col justify-start items-center space-y-7 w-full'>
        <Todo
          placeholder='Create a new todo...'
          createNewTodo
          autoFocus
          shadows
          roundedBorders='all'
        />
        <div className='w-full h-full rounded-md shadow-lg'>
          {/* show loading skeleton Todo */}
          {!todos && <Todo roundedBorders='t' />}
          {/* show todos */}
          {filteredTodos &&
            filteredTodos.map((todo, i) => (
              <Todo
                key={i}
                todoData={todo}
                roundedBorders={i === 0 ? 't' : undefined}
                divider
              />
            ))}
          <Filterbar
            itemsLeft={itemsLeft}
            filters={[
              TodoStatusEnum.ALL,
              TodoStatusEnum.ACTIVE,
              TodoStatusEnum.COMPLETED,
            ]}
            selected={selectedFilter}
            onChangeFilter={setSelectedFilter}
            onClearCompleted={clearCompleted}
            roundedBorders={
              !todos ? 'b' : filteredTodos?.length === 0 ? 'all' : 'b'
            }
          />
        </div>
      </div>
    </Layout>
  )
}
