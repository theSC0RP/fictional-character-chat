import React, { forwardRef, useRef } from 'react'

type Props = {
  disabled: boolean
  onSend: (value: string) => void
}

const MessageInput = forwardRef<HTMLInputElement, Props>(({ disabled, onSend }, ref) => {
  const localRef = useRef<HTMLInputElement | null>(null)

  // bridge the forwarded ref and a local ref so we can read it in handlers
  const setRef = (el: HTMLInputElement | null) => {
    localRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value
      if (value.trim()) {
        onSend(value)
        ;(e.target as HTMLInputElement).value = ''
      }
    }
  }

  const handleClick = () => {
    const el = localRef.current
    if (!el) return
    const value = el.value
    if (value.trim()) {
      onSend(value)
      el.value = ''
    }
  }

  return (
    <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex space-x-2">
      <input
        ref={setRef}
        type="text"
        onKeyDown={handleKey}
        placeholder="Type your message..."
        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500 text-white placeholder-gray-400"
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`px-4 py-2 rounded ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
      >
        Send
      </button>
    </div>
  )
})

export default MessageInput