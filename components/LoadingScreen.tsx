import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const randomArray = [
    ...(new Array(Math.round(Math.random() * 7.5)) || 1),
  ].map((_n, i) => i + 1)
  const [percentages, setPercentages] = useState<number[]>(randomArray)

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentages(randomArray)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-light-background dark:bg-dark-background">
      <div className="flex group gap-1 animate-wiggle">
        {percentages.map((k) => (
          <div
            key={k}
            className={`flex justify-center items-center h-8 w-8 rounded-full bg-gradient-to-tr from-background-purple-pink to-background-cyan hover:to-red-${randomSaturation()} transform hover:${randomNegative()}translate-y-10 transition ease-in duration-${randomDuration(
              { min: 300 }
            )} animate-slow-ping`}
          />
        ))}
      </div>
    </div>
  )
}

function randomIndex(arr: unknown[]): number {
  return Math.floor(Math.random() * arr.length)
}

function randomNegative(): '-' | '' {
  return Math.floor(Math.random() * 2) === 0 ? '-' : ''
}

interface MinMax {
  min?: number
  max?: number
}
function randomDuration({ min, max }: MinMax = {}): number {
  const possibleOutputs = [75, 100, 150, 200, 300, 500, 700, 1000]
    .filter((n) => (min ? n > min : n))
    .filter((n) => (max ? n < max : n))

  return possibleOutputs[randomIndex(possibleOutputs)] as number
}

function randomSaturation({ min, max }: MinMax = {}): number {
  const possibleOutputs = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    .filter((n) => (min ? n > min : n))
    .filter((n) => (max ? n < max : n))

  return possibleOutputs[randomIndex(possibleOutputs)] as number
}
