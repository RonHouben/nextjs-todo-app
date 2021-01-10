import { GetServerSideProps } from 'next'
import { ThemeProvider } from 'next-themes'
// import { FirebaseAppProvider } from 'reactfire'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import Filterbar from '../components/Filterbar'
import Paper from '../components/Paper'
import useTodos from '../hooks/useTodos'
import { ITodo, ITodoStatusEnum } from '../utils/interfaces/todos'
import { getTodos } from './api/todos'

import TodosList from '../components/TodosList'
import CreateTodoField from '../components/CreateTodoField'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseApp } from '../lib/firebaseClient'

interface InitialProps {
  initialData: ITodo[]
}

export default function TodoApp({ initialData }: InitialProps) {
  const [selectedFilter, setSelectedFilter] = useState<ITodoStatusEnum>(
    ITodoStatusEnum.ALL
  )

  const { clearCompleted, activeTodosLeft } = useTodos({ initialData })

  return (
    <ThemeProvider
      attribute='class'
      themes={['light', 'dark']}
      defaultTheme='light'
    >
      <FirebaseAppProvider firebaseApp={firebaseApp}>
        <Layout pageTitle='TODO'>
          <div className='flex flex-col justify-start items-center space-y-7 w-full'>
            <Paper rounded shadow>
              <CreateTodoField autoFocus />
            </Paper>
            <Paper rounded shadow verticalDivider>
              <TodosList initialData={initialData} filter={selectedFilter} />
              <Filterbar
                itemsLeft={activeTodosLeft()}
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
      </FirebaseAppProvider>
    </ThemeProvider>
  )
}

export const getServerSideProps: GetServerSideProps<InitialProps> = async () => {
  // get initial todos from the backend
  const initialData = await getTodos()

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(initialData)),
    },
  }
}
