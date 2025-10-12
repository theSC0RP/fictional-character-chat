import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/api/auth";
import { LogIn, LogOut, MessageCirclePlus, UserPlus } from "lucide-react";

export default function Home() {
  const { logout, isAuthenticated } = useAuth();
  console.log("is authenticated: ", isAuthenticated)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Fictional Chat</h1>
      <p className="text-gray-400 mb-8">
        Chat with your favorite fictional characters — powered by AI.
      </p>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <div className="flex items-center">
            <Link
              to="/sign-in"
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
            >
              <LogIn className="mr-2 h-5 w-5"/> Sign In
            </Link>
            <Link
              to="/sign-up"
              className="flex items-center ml-8 border border-blue-600 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-medium"
            >
              <UserPlus className="mr-2 h-5 w-5"/>Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <Link
              to="/chat"
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
            >
              <MessageCirclePlus className="mr-2 h-5 w-5"/> Start Chatting
            </Link>
            <Button
              variant="outline"
              className="flex px-6 py-2 ml-8 h-[40px] bg-transparent border-1 border-red-400 text-red-400 hover:text-red-500 hover:bg-transparent hover:border-red-600 cursor-pointer"
              onClick={logout}
            >
              <LogOut className="mr-2"/> Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
