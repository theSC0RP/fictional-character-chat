export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Fictional Chat</h1>
      <p className="text-gray-400 mb-8">
        Chat with your favorite fictional characters — powered by AI.
      </p>
      <div className="space-x-4">
        <a
          href="/sign-in"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
        >
          Sign In
        </a>
        <a
          href="/sign-up"
          className="border border-blue-600 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-medium"
        >
          Sign Up
        </a>
      </div>
    </div>
  )
}
