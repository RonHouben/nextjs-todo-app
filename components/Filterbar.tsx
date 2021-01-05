import { TodoStatusEnum } from '../hooks/useTodos'

interface Props {
  itemsLeft: number
  filters: TodoStatusEnum[]
  selected: TodoStatusEnum
  onChangeFilter: (newStatus: TodoStatusEnum) => void
  onClearCompleted: () => void
}

interface Filter {
  label: TodoStatusEnum
  active: boolean
}

export default function Filterbar({
  itemsLeft,
  filters: filterLabels,
  selected,
  onChangeFilter,
  onClearCompleted,
}: Props) {
  const filters: Filter[] = filterLabels.map((filterLabel) =>
    filterLabel === selected
      ? { label: filterLabel, active: true }
      : { label: filterLabel, active: false }
  )

  return (
    <div
      className={`flex flex-wrap w-full h-full justify-center items-center p-2 text-dark-5 bg-light-0 dark:bg-dark-1 divide-x-2 xs:divide-x-0 xs:divide-y-2 divide-light-1 dark:divide-dark-6 divide-solid divide-opacity-50`}
    >
      <div className='px-4'>{itemsLeft} items left</div>
      <div className='flex justify-between space-x-4 px-4'>
        {filters.map(({ label, active }, i) => (
          <div
            key={i}
            className={`${
              active
                ? 'text-active'
                : 'hover:text-light-4 dark:hover:text-dark-2'
            } cursor-pointer`}
            onClick={() => onChangeFilter(label)}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        className='px-4 hover:text-light-4 dark:hover:text-dark-2 cursor-pointer'
        onClick={onClearCompleted}
      >
        Clear Completed
      </div>
    </div>
  )
}
