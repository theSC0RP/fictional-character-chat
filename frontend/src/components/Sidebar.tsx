import React, { Fragment } from 'react'
import CharacterCard from './CharacterCard.tsx'
import type { Character } from '../types'

type Props = {
  defaultCharacters: Character[]
  characters: Character[]
  selectedId: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

const Sidebar: React.FC<Props> = ({ defaultCharacters, characters, selectedId, onSelect, onDelete, onAdd }) => (
  <aside className="w-64 border-t border-gray-700 bg-gray-900 text-white flex flex-col">
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      <p className="py-2 text-lg">Default Characters</p>
      {
        defaultCharacters.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            selected={char.id === selectedId}
            onSelect={() => onSelect(char.id)}
            onDelete={() => onDelete(char.id)}
          />
        ))
      }

      {
        characters.length > defaultCharacters.length && 
        <div className='mt-6 border-t border-gray-700'>
          <p className="py-4 text-lg"> Your Characters </p>
          {
            characters.slice(defaultCharacters.length, characters.length).map(char => (
              <CharacterCard
                key={char.id}
                character={char}
                selected={char.id === selectedId}
                onSelect={() => onSelect(char.id)}
                onDelete={() => onDelete(char.id)}
              />
            ))
          }
        </div>
      }
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