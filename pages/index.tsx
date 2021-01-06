import React, { useEffect, useState } from 'react'
import Filterbar from '../components/Filterbar'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import Todo from '../components/Todo'
import useTodos from '../hooks/useTodos'
import { ITodo, ITodoStatusEnum } from '../interfaces/todos'
import { GetServerSidePropsResult } from 'next'
import { getTodos } from './api/todos'

interface InitialProps {
  initialData: ITodo[]
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<InitialProps>
> {
  const initialData = await getTodos()

  return { props: { initialData } }
}

export default function Home({ initialData }: InitialProps) {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  )
  const { todos, error, itemsLeft, filterByStatus, clearCompleted } = useTodos({
    initialData,
  })
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>(todos || [])

  if (error) return <div>ERROR! {error.message}</div>

  // apply filter when selectedFilter or todos change
  useEffect(() => {
    setFilteredTodos(filterByStatus(selectedFilter))
  }, [selectedFilter, todos])

  return (
    <Layout pageTitle='TODO'>
      <div className='flex flex-col justify-start items-center space-y-7 w-full'>
        <Paper rounded shadow>
          <Todo placeholder='Create a new todo...' createNewTodo autoFocus />
        </Paper>
        <Paper rounded shadow verticalDivider>
          {/* show loading skeleton Todo */}
          {!todos && <Todo />}
          {/* show todos */}
          {filteredTodos.map((todo, i) => (
            <Todo key={i} id={todo.id} initialData={todo} />
          ))}
          <Filterbar
            itemsLeft={itemsLeft}
            filters={[
              ITodoStatusEnum.ALL,
              ITodoStatusEnum.ACTIVE,
              ITodoStatusEnum.COMPLETED,
            ]}
            selected={selectedFilter}
            onChangeFilter={setSelectedFilter}
            onClearCompleted={clearCompleted}
          />
        </Paper>
      </div>
    </Layout>
  )
}
