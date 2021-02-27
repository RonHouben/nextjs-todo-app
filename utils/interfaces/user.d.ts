export interface IUser {
  name: string
  email: string
}

export interface IUserProfileData extends IUser {
  providerIds: ProviderId[]
}

export type ProviderId = 'google.com' | 'github.com' | 'email-password'
