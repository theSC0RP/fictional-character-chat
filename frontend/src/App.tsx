// File: src/App.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { nanoid } from 'nanoid'
import Sidebar from './components/Sidebar'
import AddCharacterModal from './components/AddCharacterModal'
import EmptyChat from './components/EmptyChat'
import type { Character } from './types'
import './App.css'

const USER_ID = 'dev'
const API_BASE = 'http://localhost:8000'
const STORAGE_KEY = 'chatCharacters'       // user-added characters only
const LAST_SELECTED_KEY = 'lastSelectedId' // remember last selection

const defaultCharacters: Character[] = [
  { id: 'yoda', name: 'Yoda', universe: 'Star Wars', default: true },
  { id: 'gandalf', name: 'Gandalf', universe: 'Lord of the Rings', default: true },
  { id: 'hermione', name: 'Hermione Granger', universe: 'Harry Potter', default: true },
  { id: 'jack_sparrow', name: 'Jack Sparrow', universe: 'Pirates of the Caribbean', default: true },
  { id: 'naruto', name: 'Uzumaki Naruto', universe: 'Naruto', default: true },
  { id: 'tony_stark', name: 'Tony Stark', universe: 'Marvel Cinematic Universe', default: true },
  { id: 'luffy', name: 'Monkey D. Luffy', universe: 'One Piece', default: true }
]

type Message = { role: 'user' | 'assistant' | 'loading'; content: string }

const App: React.FC = () => {
  // keep user-added separate; we won't mutate defaults
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const allCharacters = useMemo(
    () => [...defaultCharacters, ...userCharacters],
    [userCharacters]
  )

  const [selected, setSelected] = useState<Character>(defaultCharacters[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [showModal, setShowModal] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // WebSocket
  const wsRef = useRef<WebSocket | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  // ---- LocalStorage: load user-added & last selected on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const stored: Character[] = raw ? JSON.parse(raw) : []
      setUserCharacters(stored)

      const lastSelectedId = localStorage.getItem(LAST_SELECTED_KEY)
      if (lastSelectedId) {
        const found = [...defaultCharacters, ...stored].find(c => c.id === lastSelectedId)
        if (found) setSelected(found)
      }
    } catch (e) {
      console.warn('Failed to parse stored characters', e)
    }
  }, [])

  // Persist user-added whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userCharacters))
  }, [userCharacters])

  // Persist last selected id
  useEffect(() => {
    localStorage.setItem(LAST_SELECTED_KEY, selected.id)
  }, [selected.id])

  // ---- History: fetch from API on character change
  useEffect(() => {
    let cancelled = false
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history/${USER_ID}/${selected.id}?limit=40`)
        const data = await res.json()
        if (cancelled) return
        const mapped: Message[] = (data.messages ?? [])
          .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m: any) => ({ role: m.role, content: m.content }))
        setMessages(mapped)
      } catch (e) {
        console.error('Failed to load history', e)
        setMessages([])
      }
    }
    loadHistory()
    return () => { cancelled = true }
  }, [selected.id])

  // ---- WebSocket: per-session (sessionId === selected.id)
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
      setWsConnected(false)
    }
    const sessionId = selected.id
    const socket = new WebSocket(`ws://localhost:8000/chat/${USER_ID}/${sessionId}`)
    wsRef.current = socket

    socket.onopen = () => setWsConnected(true)
    socket.onerror = (err) => {
      console.error('WebSocket error', err)
      setWsConnected(false)
    }
    socket.onmessage = ev => {
      const data = JSON.parse(ev.data)
      setMessages(prev => {
        const cleaned = prev.filter(m => m.role !== 'loading')
        return [...cleaned, { role: 'assistant', content: data.response }]
      })
    }
    socket.onclose = () => {
      setWsConnected(false)
      wsRef.current = null
    }

    return () => {
      socket.close()
    }
  }, [selected.id])

  // ---- Character CRUD (user-added only)
  const handleAdd = (newChar: Omit<Character, 'id'>) => {
    // const char: Character = { ...newChar, id: nanoid(8) }
    const char: Character = { ...newChar, id: newChar.name.toLowerCase() }
    setUserCharacters(prev => {
      const next = [...prev, char]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) // immediate persist
      return next
    })
    setShowModal(false)
    setSelected(char) // auto-select new
    setMessages([])
  }

  const handleDelete = (id: string) => {
    // block deleting defaults
    if (defaultCharacters.some(d => d.id === id)) return

    setUserCharacters(prev => {
      const next = prev.filter(c => c.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) // immediate persist
      return next
    })

    if (selected.id === id) {
      setSelected(defaultCharacters[0])
      setMessages([])
      setMessageInput('')
    }
  }

  // ---- Chat
  const sendMessage = () => {
    if (!messageInput.trim() || !wsRef.current || !wsConnected) return

    setMessages(prev => [
      ...prev,
      { role: 'user', content: messageInput },
      { role: 'loading', content: `${selected.name} is thinking...` }
    ])

    wsRef.current.send(JSON.stringify({
      input: messageInput,
      character: selected.name,
      universe: selected.universe
    }))
    setMessageInput('')
  }

  const hasNonLoading = messages.some(m => m.role !== 'loading')

  return (
    <div className="App flex h-screen">
      <Sidebar
        defaultCharacters={defaultCharacters}
        userCharacters={userCharacters}
        selectedId={selected.id}
        onSelect={id => {
          const next = allCharacters.find(c => c.id === id)
          if (next) {
            setSelected(next)
            setMessageInput('')
          }
        }}
        onDelete={handleDelete}
        onAdd={() => setShowModal(true)}
      />

      <div className="flex-1 flex flex-col bg-gray-900 text-white border-l border-gray-700">
        <div className="px-6 py-4 text-lg bg-gray-800 border-b border-t border-gray-700">
          Chatting with <span className="font-semibold">{selected.name}</span> from{' '}
          <span className="font-semibold">{selected.universe}</span>
        </div>

        <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-900">
          {!hasNonLoading ? (
            // NOTE: EmptyChat left untouched, as requested
            <EmptyChat
              character={selected.name}
              universe={selected.universe}
              onStart={() => {
                inputRef.current?.focus()
                setMessageInput('Hello!')
              }}
            />
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-xs p-3 rounded-lg ${
                    m.role === 'user' ? 'bg-gray-700 ml-auto' : 'bg-gray-800'
                  }`}
                >
                  {m.role !== 'loading' && (
                    <div className="font-semibold mb-1">
                      {m.role === 'user' ? 'You' : selected.name}
                    </div>
                  )}
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`Ask ${selected.name} anything...`}
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500 text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={!wsConnected}
            className={`px-4 py-2 rounded ${wsConnected ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 cursor-not-allowed'} text-white`}
          >
            Send
          </button>
        </div>
      </div>

      {showModal && <AddCharacterModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  )
}

export default App