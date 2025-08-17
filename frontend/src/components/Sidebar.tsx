// File: src/components/Sidebar.tsx
import React from 'react'
import CharacterCard from './CharacterCard.tsx'
import type { Character } from '../types'

type Props = {
  defaultCharacters: Character[]
  userCharacters: Character[]
  selectedId: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

const Sidebar: React.FC<Props> = ({
  defaultCharacters,
  userCharacters,
  selectedId,
  onSelect,
  onDelete,
  onAdd
}) => (
  <aside className="w-64 border-t border-gray-700 bg-gray-900 text-white flex flex-col">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <section>
        <p className="py-2 text-sm uppercase tracking-wide text-gray-400">Default Characters</p>
        <div className="space-y-2">
          {defaultCharacters.map(char => (
            <CharacterCard
              key={char.id}
              character={char}
              selected={char.id === selectedId}
              onSelect={() => onSelect(char.id)}
              onDelete={() => onDelete(char.id)} // handler should ignore defaults
            />
          ))}
        </div>
      </section>

      <section className="pt-4 border-t border-gray-700">
        <p className="py-2 text-sm uppercase tracking-wide text-gray-400">Your Characters</p>
        {userCharacters.length === 0 ? (
          <p className="text-xs text-gray-500">Add your own characters to see them here.</p>
        ) : (
          <div className="space-y-2">
            {userCharacters.map(char => (
              <CharacterCard
                key={char.id}
                character={char}
                selected={char.id === selectedId}
                onSelect={() => onSelect(char.id)}
                onDelete={() => onDelete(char.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>

    <div className="p-4">
      <button
        onClick={onAdd}
        className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none cursor-pointer"
      >
        + Add Character
      </button>
    </div>
  </aside>
)

export default Sidebar