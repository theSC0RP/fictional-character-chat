import type { Character } from "@/types"

export const USER_ID = 'dev'
export const API_BASE = 'http://localhost:8000'

export const STORAGE_KEY = 'chatCharacters'       // user-added only
export const LAST_SELECTED_KEY = 'lastSelectedId'  // remember last selection
export const AI_MODEL_KEY = 'ai_model'
export const defaultCharacters:Character[] = [
  { id: 'yoda', name: 'Yoda', universe: 'Star Wars', default: true },
  { id: 'gandalf', name: 'Gandalf', universe: 'Lord of the Rings', default: true },
  { id: 'hermione', name: 'Hermione Granger', universe: 'Harry Potter', default: true },
  { id: 'jack_sparrow', name: 'Jack Sparrow', universe: 'Pirates of the Caribbean', default: true },
  { id: 'naruto', name: 'Uzumaki Naruto', universe: 'Naruto', default: true },
  { id: 'tony_stark', name: 'Tony Stark', universe: 'Marvel Cinematic Universe', default: true },
  { id: 'luffy', name: 'Monkey D. Luffy', universe: 'One Piece', default: true }
] 