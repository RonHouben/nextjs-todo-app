import Image from 'next/image'
import { Key } from '../utils/interfaces/Key.enum'

interface Props {
  id: string
  checked: boolean
  onToggle: (checked: boolean) => void
}

export default function RoundCheckbox({ id, checked, onToggle }: Props) {
  const handleChange = () => {
    onToggle(!checked)
  }

  return (
    <div
      className='p-3'
      tabIndex={0}
      onKeyPress={(e) => (e.key === Key.Spacebar ? handleChange() : null)}
    >
      <input
        className='hidden'
        type='checkbox'
        id={id + 'rounded-checkbox'}
        checked={checked}
        onChange={handleChange}
      />
      <label
        htmlFor={id + 'rounded-checkbox'}
        className='flex rounded-full h-6 w-6 justify-center items-center text-xs cursor-pointer select-none bg-light-1 dark:bg-dark-6 bg-gradient-to-br hover:from-background-cyan hover:to-background-purple-pink'
      >
        {!checked && (
          <div className='bg-light-0 dark:bg-dark-1 h-5/6 w-5/6 rounded-full' />
        )}
        {checked && (
          <div className='relative flex justify-center items-center rounded-full bg-gradient-to-br from-background-cyan to-background-purple-pink h-full w-full'>
            <div className='absolute mx-auto h-3 w-3'>
              <Image layout='fill' src='/icons/icon-check.svg' />
            </div>
          </div>
        )}
      </label>
    </div>
  )
}
