export interface ITodo {
  id?: string
  title: string
  completed: boolean
  created?: Date
}

export enum ITodoStatusEnum {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
