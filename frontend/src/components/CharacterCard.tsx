import React from 'react'
import type { Character } from '../types'


type Props = {
  character: Character
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}

const CharacterCard: React.FC<Props> = ({ character, selected, onSelect, onDelete }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-lg cursor-pointer flex flex-row justify-between ${
      selected ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'
    }`}
  >
    <div className='flex flex-col'>
      <div className="text-lg font-medium text-white">{character.name}</div>
      <div className="text-sm text-gray-400">{character.universe}</div>
    </div>
    {!character.default && (
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="text-red-400 text-xs self-end cursor-pointer"
      >
        Delete
      </button>
    )}
  </div>
)

export default CharacterCard