export type Role = 'user' | 'assistant' | 'loading'

export type Message = {
  role: Role
  content: string
}

export type Character = {
  id: string
  name: string
  universe: string
  default?: boolean
}

export type SignUpRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type SignInRequest = {
  email: string
  password: string
}

export type User = {
  first_name: string
  last_name: string
  email: string
  id: string
}