// File: src/App.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import Sidebar from './components/Sidebar'
import AddCharacterModal from './components/AddCharacterModal'
import type { Character } from './types'
import './App.css'

// Default characters with nanoid-generated IDs
const defaultCharacters: Character[] = [
  { id: 'yoda', name: 'Yoda', universe: 'Star Wars', default: true },
  { id: 'gandalf', name: 'Gandalf', universe: 'Lord of the Rings', default: true },
  { id: 'hermione', name: 'Hermione Granger', universe: 'Harry Potter', default: true },
  { id: 'jack_sparrow', name: 'Jack Sparrow', universe: 'Pirates of the Caribbean', default: true },
  { id: 'naruto', name: 'Uzumaki Naruto', universe: 'Naruto', default: true },
  { id: 'tony_stark', name: 'Tony Stark', universe: 'Marvel Cinematic Universe', default: true }
]

type Message = { role: 'user' | 'assistant' | 'loading'; content: string }

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character>(defaultCharacters[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Load stored characters
  useEffect(() => {
    const stored = localStorage.getItem('chatCharacters')
    if (stored) {
      const parsed = JSON.parse(stored) as Character[]
      setCharacters([...defaultCharacters, ...parsed])
    } else {
      setCharacters(defaultCharacters)
    }
  }, [])

  // Persist user-added
  useEffect(() => {
    const userAdded = characters.filter(c => !defaultCharacters.some(d => d.id === c.id))
    localStorage.setItem('chatCharacters', JSON.stringify(userAdded))
  }, [characters])

  const handleAdd = (newChar: Omit<Character, 'id'>) => {
    const char: Character = { ...newChar, id: nanoid(8) }
    setCharacters(prev => [...prev, char])
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id))
    if (selected.id === id) {
      setSelected(defaultCharacters[0])
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!messageInput.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: messageInput }, { role: 'loading', content: `${selected.name} is thinking...` }])
    const payload = { input: messageInput, character: selected.name, universe: selected.universe }
    setMessageInput('')
    try {
      const { data } = await axios.post('http://localhost:8000/chat', payload)
      setMessages(prev => [...prev.slice(0, prev.length-1), { role: 'assistant', content: data?.response?.content ?? '' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error sending message' }])
    }
  }

  return (
    <div className="App flex h-screen">
      {/* Sidebar */}
      <Sidebar
        defaultCharacters={defaultCharacters}
        characters={characters}
        selectedId={selected.id}
        onSelect={id => {
          setSelected(characters.find(c => c.id === id)!)
          setMessages([])
          setMessageInput("")
        }}
        onDelete={handleDelete}
        onAdd={() => setShowModal(true)}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900 text-white border-l border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 text-lg bg-gray-800 border-b border-t border-gray-700">
          Chatting with <span className="font-semibold">{selected.name}</span> from <span className="font-semibold">{selected.universe}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4 bg-gray-900">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xs p-3 rounded-lg ${
                m.role === 'user' ? 'bg-gray-700 ml-auto' : 'bg-gray-800'
              }`}
            >
              {m.role !== 'loading' ? <div className="font-semibold mb-1">{m.role === 'user' ? 'You' : selected.name}</div> : '' }
              <div>{m.content}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500 text-white placeholder-gray-400"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">
            Send
          </button>
        </div>
      </div>

      {showModal && <AddCharacterModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  )
}

export default App