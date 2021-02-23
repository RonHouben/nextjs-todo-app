interface ReorderArgs<T> {
  array: T[]
  sourceIndex: number
  destinationIndex: number
}
export function reorder<T>({
  array,
  sourceIndex,
  destinationIndex,
}: ReorderArgs<T>): T[] {
  const [removed] = array.splice(sourceIndex, 1)
  return array.splice(destinationIndex, 0, removed!)
}
