import { IncomingHttpHeaders } from 'http'
import { createContext, ReactNode, useMemo } from 'react'

export interface IUserAgentContext {
  browser: 'Chrome' | 'Safari' | 'Firefox' | undefined
  isChrome: boolean
  isSafari: boolean
  isFirefox: boolean
}

export const UserAgentContext = createContext<IUserAgentContext>({
  browser: undefined,
  isChrome: false,
  isSafari: false,
  isFirefox: true,
})

export interface IUserAgentProviderProps {
  userAgent: IncomingHttpHeaders['user-agent']
  children: ReactNode
}

export const UserAgentProvider = ({
  userAgent,
  children,
}: IUserAgentProviderProps) => {
  // get the browser
  const browser = useMemo(() => getBrowser(userAgent), [userAgent])

  return (
    <UserAgentContext.Provider
      value={{
        browser,
        isChrome: browser === 'Chrome',
        // setting isFirefox to true by default to give Firebox styling priority.
        // this is needed because else Firefox will render with the unsupported CSS properties
        isFirefox: !browser ? true : browser === 'Firefox',
        isSafari: browser === 'Safari',
      }}
    >
      {children}
    </UserAgentContext.Provider>
  )
}

// helper functions
const getBrowser = (userAgent: IUserAgentProviderProps['userAgent']) => {
  const regexMatch = userAgent
    ? userAgent.match(/Chrome|Safari|Firefox/)
    : undefined

  return regexMatch
    ? (regexMatch[0] as IUserAgentContext['browser'])
    : undefined
}
