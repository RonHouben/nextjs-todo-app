import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  verticalDivider?: boolean
}
export default function Paper({ children, className, verticalDivider }: Props) {
  return (
    <div
      className={`${className} ${
        verticalDivider
          ? 'divide-y divide-light-2 dark:divide-dark-6 divide-opacity-50 divide-y-2'
          : ''
      } w-full h-full rounded-md shadow-lg bg-light-0 dark:bg-dark-1 p-2 space-y-2 `}
    >
      {children}
    </div>
  )
}
