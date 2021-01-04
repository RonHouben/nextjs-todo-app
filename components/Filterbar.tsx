interface Props {
  itemsLeft: number;
  filters: FilterLabel[];
  selected: FilterLabel;
  onChangeFilter: (newFilter: FilterLabel) => void;
}

export type FilterLabel = "All" | "Active" | "Completed";

interface Filter {
  label: FilterLabel;
  active: boolean;
}

export default function Filterbar({
  itemsLeft,
  filters: filterLabels,
  selected,
  onChangeFilter,
}: Props) {
  const filters: Filter[] = filterLabels.map((filterLabel) =>
    filterLabel === selected
      ? { label: filterLabel, active: true }
      : { label: filterLabel, active: false }
  );

  return (
    <div className="text-dark-5 flex w-full h-full justify-between items-center rounded-md p-3 shadow-lg bg-light-0 dark:bg-dark-1 ">
      <div>{itemsLeft} items left</div>
      <div className="flex space-x-4">
        {filters.map(({ label, active }, i) => (
          <div
            key={i}
            className={`${
              active
                ? "text-active"
                : "hover:text-light-4 dark:hover:text-dark-2 "
            } cursor-pointer`}
            onClick={() => onChangeFilter(label)}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="hover:text-light-4 dark:hover:text-dark-2 cursor-pointer">
        Clear Completed
      </div>
    </div>
  );
}
