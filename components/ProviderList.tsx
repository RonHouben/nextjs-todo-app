import {
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  StackDirection,
  Switch,
} from '@chakra-ui/react'
import firebase from 'firebase/app'
import React from 'react'
import { FaGithub as GithubIcon } from 'react-icons/fa'
import { FcGoogle as GoogleIcon } from 'react-icons/fc'
import { ProviderId } from '../utils/interfaces/user'

interface Props {
  onSwitchProvider: (id: ProviderId) => void
  linkedProviders: ProviderId[]
  direction: StackDirection
}

export default function ProviderList({
  onSwitchProvider,
  linkedProviders,
  direction,
}: Props) {
  const configuredProviders: ProviderId[] = ['google.com', 'github.com']

  const handleSwitchProvider = (id: ProviderId) => {
    firebase.analytics().logEvent('switched_social_provider', {
      providerId: id,
      linkedProviders,
    })

    onSwitchProvider(id)
  }

  return (
    <Stack direction={direction}>
      {configuredProviders.map((provider) => (
        <FormControl key={provider} display="flex" alignItems="center">
          <FormLabel htmlFor={provider} mb="0">
            {provider === 'google.com' && (
              <IconButton
                as={GoogleIcon}
                aria-label={provider}
                size="sm"
                rounded="full"
                variant="unstyled"
                cursor="initial"
              />
            )}
            {provider === 'github.com' && (
              <IconButton
                as={GithubIcon}
                aria-label={provider}
                size="sm"
                rounded="full"
                variant="unstyled"
                cursor="initial"
              />
            )}
          </FormLabel>
          <Switch
            id={provider}
            colorScheme="teal"
            isChecked={linkedProviders?.some((l) => l === provider) || false}
            onChange={() => handleSwitchProvider(provider)}
          />
        </FormControl>
      ))}
    </Stack>
  )
}
