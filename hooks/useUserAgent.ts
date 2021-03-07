import { useEffect, useState } from 'react'

interface IUserAgentResult {
  browser: 'Chrome' | 'Safari' | 'Firefox' | undefined
  isChrome: boolean
  isSafari: boolean
  isFirefox: boolean
}

export const useUserAgent = (): IUserAgentResult => {
  const [browser, setBrowser] = useState<IUserAgentResult['browser']>()

  if (process.browser && navigator) {
    useEffect(() => {
      setBrowser(getBrowser(navigator.userAgent))
    }, [navigator.userAgent])
  }

  return {
    browser,
    isChrome: browser === 'Chrome',
    isFirefox: browser === 'Firefox',
    isSafari: browser === 'Safari',
  }
}

// helper functions
const getBrowser = (userAgent: NavigatorID['userAgent']) => {
  const regexMatch = userAgent
    ? userAgent.match(/Chrome|Safari|Firefox/)
    : undefined

  return regexMatch ? (regexMatch[0] as IUserAgentResult['browser']) : undefined
}
