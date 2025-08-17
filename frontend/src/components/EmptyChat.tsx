import React from 'react'

type Props = {
  character: string
  universe: string
  onStart?: () => void
}

const EmptyChat: React.FC<Props> = ({ character, universe, onStart }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gray-800/70 flex items-center justify-center border border-gray-700">
          {/* chat-bubble icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h4m-6 4h6a6 6 0 0 0 6-6v0a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v0a6 6 0 0 0 6 6z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 18v2a1 1 0 0 0 1.447.894L13 20"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-100">
          Ready to chat with {character}?
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          You’re in the <span className="font-medium text-gray-300">{universe}</span> universe.
          Break the ice with a hello—or ask a wild question.
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium focus:outline-none focus:ring focus:ring-indigo-500/50"
          >
            Say hi to {character}
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Tip: Press <span className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">Enter</span> to send
        </p>
      </div>
    </div>
  )
}

export default EmptyChat