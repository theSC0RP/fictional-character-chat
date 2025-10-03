import { useState, useRef } from 'react'
import Sidebar from './components/Sidebar'
import AddCharacterModal from './components/AddCharacterModal'
import EmptyChat from './components/EmptyChat'
import ChatHeader from './components/chat/ChatHeader'
import MessageList from './components/chat/MessageList'
import MessageInput from './components/chat/MessageInput'
import { defaultCharacters } from './lib/constants'
import type { Character } from './types'
import './App.css'
import { useChatContext } from './context/ChatContext'
import { useCharactersContext } from './context/CharactersContext'

export default function App() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { allCharacters, userCharacters, selected, setSelected, addCharacter, deleteCharacter } = useCharactersContext()
  const { messages, sendMessage, connected, hasNonLoading } = useChatContext()
  const [showModal, setShowModal] = useState(false)

  const onSelect = (id: string) => {
    console.log(id)
    const next = allCharacters.find(c => c.id === id)
    if (next) setSelected(next)
  }

  return (
    <div className="App flex h-screen">
      <Sidebar
        defaultCharacters={defaultCharacters as unknown as Character[]}
        userCharacters={userCharacters}
        selectedId={selected.id}
        onSelect={onSelect}
        onDelete={deleteCharacter}
        onAdd={() => setShowModal(true)}
      />

      <div className="flex-1 flex flex-col bg-gray-900 text-white border-l border-gray-700">
        <ChatHeader name={selected.name} universe={selected.universe} />

        <div className="flex-1 px-6 py-4 overflow-y-auto bg-gray-900">
          {!hasNonLoading ? (
            <EmptyChat
              character={selected.name}
              universe={selected.universe}
              onStart={() => {
                inputRef.current?.focus()
                inputRef.current!.value = 'Hello!'
              }}
            />
          ) : (
            <MessageList messages={messages} who={selected.name} />
          )}
        </div>

        <MessageInput ref={inputRef} disabled={!connected} onSend={sendMessage} />
      </div>

      {showModal && (
        <AddCharacterModal
          onClose={() => setShowModal(false)}
          onSave={(nc) => { addCharacter(nc); setShowModal(false) }}
        />
      )}
    </div>
  )
}