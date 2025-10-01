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