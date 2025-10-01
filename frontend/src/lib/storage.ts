import type { Character } from '../types'
import { LAST_SELECTED_KEY, STORAGE_KEY } from './constants'

export function loadUserCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Failed to parse stored characters', e)
    return []
  }
}

export function saveUserCharacters(chars: Character[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars))
}

export function loadLastSelectedId(): string | null {
  return localStorage.getItem(LAST_SELECTED_KEY)
}

export function saveLastSelectedId(id: string) {
  localStorage.setItem(LAST_SELECTED_KEY, id)
}