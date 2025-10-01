import type { Message } from '../../types'

export default function MessageBubble({ m, who }: { m: Message; who: string }) {
  const isUser = m.role === 'user'
  const isLoading = m.role === 'loading'
  return (
    <div className={`max-w-xs p-3 rounded-lg ${isUser ? 'bg-gray-700 ml-auto' : 'bg-gray-800'}`}>
      {!isLoading && (
        <div className="font-semibold mb-1">{isUser ? 'You' : who}</div>
      )}
      <div>{m.content}</div>
    </div>
  )
}