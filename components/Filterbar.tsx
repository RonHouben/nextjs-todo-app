import { Button, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { ITodoStatusEnum } from '../utils/interfaces/todo'

interface Props {
  itemsLeft: number
  filters: ITodoStatusEnum[]
  selected: ITodoStatusEnum
  onChangeFilter: (newStatus: ITodoStatusEnum) => void
  onClearCompleted: () => void
}

interface Filter {
  label: ITodoStatusEnum
  active: boolean
}

export default function Filterbar({
  itemsLeft,
  filters: filterLabels,
  selected,
  onChangeFilter,
  onClearCompleted,
}: Props) {
  const activeTextColor = useColorModeValue('secondary.light', 'secondary.dark')
  const filters: Filter[] = filterLabels.map((filterLabel) =>
    filterLabel === selected
      ? { label: filterLabel, active: true }
      : { label: filterLabel, active: false }
  )

  return (
    <Stack
      direction="row"
      wrap="wrap"
      py="2"
      spacing={2}
      align="center"
      justifyContent="center"
    >
      <Text fontSize="md" px="5">
        {itemsLeft} items left
      </Text>
      <div>
        {filters.map(({ label, active }, i) => (
          <Button
            key={i}
            variant="ghost"
            color={active ? activeTextColor : undefined}
            onClick={() => onChangeFilter(label)}
            onKeyPress={() => onChangeFilter(label)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        onClick={onClearCompleted}
        onKeyPress={onClearCompleted}
      >
        Clear Completed
      </Button>
    </Stack>
  )
}
