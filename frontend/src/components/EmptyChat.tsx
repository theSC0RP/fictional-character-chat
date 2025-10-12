import { Bot, Hand, MessageCircle } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

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
          <MessageCircle />
        </div>

        <h3 className="text-xl font-semibold text-gray-100">
          Ready to chat with {character}?
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          You’re in the <span className="font-medium text-gray-300">{universe}</span> universe.
          Break the ice with a hello - or ask a wild question.
        </p>

        <div className="mt-5">
          <Button
            type="button"
            onClick={onStart}
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium focus:outline-none focus:ring focus:ring-indigo-500/50"
          >
            <Hand /> Say hi to {character}
          </Button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Tip: Press <span className="px-1 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">Enter</span> to send
        </p>
      </div>
    </div>
  )
}

export default EmptyChat