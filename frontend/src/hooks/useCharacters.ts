import { useEffect, useMemo, useState } from 'react'
import type { Character } from '../types'
import { defaultCharacters } from '../lib/constants'
import { loadLastSelectedId, loadUserCharacters, saveLastSelectedId, saveUserCharacters } from '../lib/storage'

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

export function useCharacters() {
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [selected, setSelected] = useState<Character>(defaultCharacters[0])
  const allCharacters = useMemo(() => {
    return [...defaultCharacters, ...userCharacters]
  }, [userCharacters])

  useEffect(() => {
    const stored = loadUserCharacters()
    setUserCharacters(stored)
    const last = loadLastSelectedId()
    if (last) {
      const found = [...defaultCharacters, ...stored].find(c => c.id === last)
      if (found) setSelected(found)
    }
  }, [])

  useEffect(() => {
    saveUserCharacters(userCharacters)
  }, [userCharacters])

  useEffect(() => {
    saveLastSelectedId(selected.id)
  }, [selected.id])

  const addCharacter = (newChar: Omit<Character, 'id'>) => {
    const char: Character = { ...newChar, id: toSlug(newChar.name) }
    setUserCharacters(prev => {
      const next = [...prev, char]
      saveUserCharacters(next)
      return next
    })
    setSelected(char)
  }

  const deleteCharacter = (id: string) => {
    if (defaultCharacters.some(d => d.id === id)) return
    setUserCharacters(prev => {
      const next = prev.filter(c => c.id !== id)
      saveUserCharacters(next)
      return next
    })
    if (selected.id === id) setSelected(defaultCharacters[0])
  }

  return { allCharacters, userCharacters, selected, setSelected, addCharacter, deleteCharacter }
}