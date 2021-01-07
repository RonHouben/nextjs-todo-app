import { IFirebarServerTimestamp } from '../../lib/firebaseClient'
export interface ITodo {
  id?: string
  title: string
  completed: boolean
  created?: IFirebarServerTimestamp
}

export enum ITodoStatusEnum {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
