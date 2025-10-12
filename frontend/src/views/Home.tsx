import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  MessageCirclePlus,
  UserPlus,
  Github,
  Database,
  Zap,
} from "lucide-react";

export default function Home() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Fictional Chat
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl">
          Carry on intelligent conversations with your favorite fictional characters —
          powered by locally hosted AI models through Ollama.
        </p>

        <div className="space-x-4">
          {!isAuthenticated ? (
            <div className="flex items-center">
              <Link
                to="/sign-in"
                className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
              >
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </Link>
              <Link
                to="/sign-up"
                className="flex items-center ml-8 border border-blue-600 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-medium"
              >
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/chat"
                className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
              >
                <MessageCirclePlus className="mr-2 h-5 w-5" /> Start Chatting
              </Link>
              <Button
                variant="outline"
                className="flex px-6 py-2 ml-8 h-[40px] bg-transparent border border-red-400 text-red-400 hover:text-red-500 hover:border-red-600"
                onClick={logout}
              >
                <LogOut className="mr-2" /> Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="px-6 py-16 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">
          Features
        </h2>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Character-Based Chat
            </h3>
            <p>
              Choose from predefined fictional characters or create your own
              personalities to chat with.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Persistent Sidebar
            </h3>
            <p>
              Access all your favorite characters quickly. User-added characters
              reload automatically on startup.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Local LLM Hosting
            </h3>
            <p>
              Run LLMs like Llama 3.2, Gemma 3, and Mistral locally via Ollama —
              ensuring privacy and full control.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Secure & Persistent Storage
            </h3>
            <p>
              MongoDB powers long-term chat and user data storage, ensuring
              reliability and scalability for your fictional worlds.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Fast In-Memory Caching
            </h3>
            <p>
              Redis boosts real-time performance with quick caching and token
              management for smooth, lag-free conversations.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-blue-500/20 transition">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Modern UI
            </h3>
            <p>
              Built using React, TypeScript, and Tailwind with clean components
              and accessibility in mind.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-400">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto text-gray-300 space-y-4 text-lg leading-relaxed">
          <p>
            Fictional Chat connects your frontend (React + Tailwind) to a FastAPI
            backend that serves local LLMs hosted with Ollama.
          </p>
          <p>
            When you start chatting, your messages are securely sent to the
            backend via WebSockets. The backend forwards them to the selected
            local model (like <strong>Llama 3.2</strong> or{" "}
            <strong>Gemma 3</strong>) and streams the response back in
            real-time.
          </p>
          <p>
            All user sessions and chat histories are stored in{" "}
            <strong>MongoDB</strong>, while <strong>Redis</strong> handles
            authentication tokens and real-time caching for better performance.
          </p>
          <p>
            Since everything runs locally through Docker and Ollama, your
            conversations never leave your machine which gives you complete
            privacy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-auto text-center text-gray-400 border-t border-gray-700">
        <p>
          Built by{" "}
          <span className="text-white font-semibold">Gandhar Rajan Bichkar</span> ·{" "}
          <a
            href="https://github.com/theSC0RP/fictional-character-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:underline"
          >
            <Github className="h-4 w-4 mr-1" /> View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
