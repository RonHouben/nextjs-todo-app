import React, { useState } from 'react'
import Filterbar from '../components/Filterbar'
import Layout from '../components/Layout'
import Paper from '../components/Paper'
import useTodos from '../hooks/useTodos'
import { ITodo, ITodoStatusEnum } from '../utils/interfaces/todos'
import { GetServerSideProps, NextPage } from 'next'
import { getTodos } from './api/todos'

import TodosList from '../components/TodosList'
import CreateTodoField from '../components/CreateTodoField'

interface InitialProps {
  initialData: ITodo[]
}

// export default function Home({}: NextPage<InitialProps>) {
const Home: NextPage<InitialProps> = ({ initialData }) => {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  )

  // const { error, clearCompleted } = useTodos({ initialData })
  const { error, clearCompleted, todosLeft } = useTodos()

  if (error) return <div>ERROR! {error.message}</div>

  return (
    <Layout pageTitle='TODO'>
      <div className='flex flex-col justify-start items-center space-y-7 w-full'>
        <Paper rounded shadow>
          <CreateTodoField autoFocus />
        </Paper>
        <Paper rounded shadow verticalDivider>
          <TodosList initialData={initialData} filter={selectedFilter} />
          <Filterbar
            itemsLeft={todosLeft}
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

export default Home

export const getServerSideProps: GetServerSideProps<InitialProps> = async () => {
  // get initial todos from the backend
  const initialData = await getTodos()

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(initialData)),
    },
  }
}
