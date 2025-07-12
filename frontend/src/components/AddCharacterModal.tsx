// src/components/AddCharacterModal.tsx
import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import type { Character } from '../types'

type Props = {
  onClose: () => void
  onSave: (char: Omit<Character, 'id'>) => void
}

const AddCharacterModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [name, setName] = useState('')
  const [universe, setUniverse] = useState('')

  const canSave = Boolean(name.trim() && universe.trim())

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-30"
        onClick={onClose}
      />

      {/* Panel container */}
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
        <Dialog.Panel
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        >
          <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
            Add New Character
          </Dialog.Title>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              placeholder="Character Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
            <input
              type="text"
              placeholder="Universe"
              value={universe}
              onChange={e => setUniverse(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => canSave && onSave({ name, universe })}
              disabled={!canSave}
              className="py-2 px-4 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default AddCharacterModal