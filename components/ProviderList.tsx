import {
  GithubLoginButton,
  GoogleLoginButton,
} from 'react-social-login-buttons'
import { ProviderId } from '../utils/interfaces/user'

interface Props {
  onClick: (id: ProviderId) => void
  providers?: ProviderId[]
  filterOut?: ProviderId[]
}

const configuredProviders: ProviderId[] = ['google.com', 'github.com']

export default function ProviderList({
  onClick,
  filterOut,
  providers = configuredProviders,
}: Props) {
  // const providers: ProviderId[] = ([
  //   'google.com',
  //   'github.com',
  // ] as ProviderId[]).filter((p) => !filterOut?.some((f) => f === p))

  return (
    <ul>
      {providers
        .filter((p) => !filterOut?.some((f) => f === p))
        .map((p) => (
          <li key={p} onClick={() => onClick(p)} className="cursor-pointer">
            {p === 'google.com' && (
              <GoogleLoginButton
                text="Link with Google"
                style={{ background: 'inherit', color: 'inherit' }}
                preventActiveStyles
              />
            )}
            {p === 'github.com' && (
              <GithubLoginButton
                text="Link with Github"
                style={{ background: 'inherit', color: 'inherit' }}
                preventActiveStyles
              />
            )}
          </li>
        ))}
    </ul>
  )
}
