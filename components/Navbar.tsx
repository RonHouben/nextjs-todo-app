import ThemeSwitcherButton from './ThemeSwitcherButton'

interface Props {
  pageTitle?: string
}

export default function Navbar({ pageTitle }: Props) {
  return (
    <div className='flex justify-between items-center prose prose-sm lg:prose-lg prose-green'>
      {/* <div className='text-light-0 font-bold text-3xl tracking-navigation'> */}
      <h1 className='uppercase prose prose-green'>{pageTitle || null}</h1>
      {/* </div> */}
      <ThemeSwitcherButton />
    </div>
  )
}
