import { useContext } from 'react'
import {
  IUserAgentContext,
  UserAgentContext,
} from '../providers/UserAgentProvider'

export const useUserAgent = () =>
  useContext<IUserAgentContext>(UserAgentContext)
