import type { Message } from '../../types'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages, who }: { messages: Message[]; who: string }) {
  return (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <MessageBubble key={i} m={m} who={who} />
      ))}
    </div>
  )
}