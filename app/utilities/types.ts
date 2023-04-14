export type UserType = {
    email: string
    id: string
    username: string
    avatarUrl: string
}

export type AuthInput = {
  email: string
  password: string
  username: string | ''
  redirectTo?: string
  token?: string
}
