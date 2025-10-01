export default function ChatHeader({ name, universe }: { name: string; universe: string }) {
  return (
    <div className="px-6 py-4 text-lg bg-gray-800 border-b border-t border-gray-700">
      Chatting with <span className="font-semibold">{name}</span> from{' '}
      <span className="font-semibold">{universe}</span>
    </div>
  )
}
