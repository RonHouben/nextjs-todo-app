import {
  Flex,
  useColorMode,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react'
import random from 'lodash/random'
import React, { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const { colors } = useTheme()

  const { colorMode } = useColorMode()
  const startColor = useColorModeValue('primary', 'secondary')
  const endColor = useColorModeValue('secondary', 'primary')
  const randomDuration = random(1, 3, true)

  const [randomArray, setRandomArray] = useState<number[]>(
    [...new Array(random(1, 7, false))].map((_n, i) => i + 1)
  )

  // regenerate randomArray
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomArray([...new Array(random(1, 7, false))].map((_n, i) => i + 1))
    }, randomDuration * 1000)

    return () => clearInterval(interval)
  }, [randomDuration])

  return (
    <Flex h="xl" justifyContent="center" alignItems="center">
      <Flex>
        {randomArray.map((k) => (
          <Flex
            key={k}
            justifyContent="center"
            alignItems="center"
            h="8"
            w="8"
            rounded="full"
            shadow="dark-lg"
            backgroundImage={`linear-gradient(to bottom right, ${colors[startColor][colorMode]}, ${colors[endColor][colorMode]})`}
            animation={`ping ${randomDuration}s cubic-bezier(0, 0, 0.2, 1) infinite`}
          />
        ))}
      </Flex>
    </Flex>
  )
}
