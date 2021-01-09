export interface ITodo {
  id: string
  title: string
  completed: boolean
  created?: FirebaseFirestore.Timestamp
}

export enum ITodoStatusEnum {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}
