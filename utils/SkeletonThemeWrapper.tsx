import { useTheme } from 'next-themes'
import React, { ReactNode } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import tailwindConfig from '../tailwind.config'

interface Props {
  children: ReactNode
}

export default function SkeletonThemeWrapper({ children }: Props) {
  const { theme } = useTheme()

  return (
    <SkeletonTheme
      color={
        theme === 'light'
          ? tailwindConfig.theme.extend.colors.light[2]
          : tailwindConfig.theme.extend.colors.dark[1]
      }
      highlightColor={
        theme === 'light'
          ? tailwindConfig.theme.extend.colors.light[1]
          : tailwindConfig.theme.extend.colors.dark[0]
      }
    >
      {children}
    </SkeletonTheme>
  )
}
