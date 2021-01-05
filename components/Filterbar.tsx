import { TodoStatusEnum } from '../hooks/useTodos'

interface Props {
  itemsLeft: number
  filters: TodoStatusEnum[]
  selected: TodoStatusEnum
  onChangeFilter: (newStatus: TodoStatusEnum) => void
  onClearCompleted: () => void
  roundedBorders?:
    | 't'
    | 'tr'
    | 'r'
    | 'rb'
    | 'b'
    | 'bl'
    | 'l'
    | 'tl'
    | 'all'
    | undefined
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
  roundedBorders,
}: Props) {
  const filters: Filter[] = filterLabels.map((filterLabel) =>
    filterLabel === selected
      ? { label: filterLabel, active: true }
      : { label: filterLabel, active: false }
  )

  return (
    <div
      className={`${
        roundedBorders
          ? roundedBorders === 'all'
            ? `rounded-md`
            : `rounded-${roundedBorders}-md`
          : ''
      } text-dark-5 flex flex-wrap w-full h-full p-3 justify-center items-center bg-light-0 dark:bg-dark-1 divide-x-2 divide-light-2 dark:divide-dark-6 divide-solid divide-opacity-20`}
    >
      <div className='px-4'>{itemsLeft} items left</div>
      <div className='flex flex-wrap justify-between space-x-4 px-4'>
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
