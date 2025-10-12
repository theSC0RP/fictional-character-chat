import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/api/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  console.log("is authenticated: ", isAuthenticated)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Fictional Chat</h1>
      <p className="text-gray-400 mb-8">
        Chat with your favorite fictional characters — powered by AI.
      </p>
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link
              to="/sign-in"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="border border-blue-600 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-medium"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/chat"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium"
            >
              Start Chatting
            </Link>
            <Button
              variant="outline"
              className="ml-4 bg-transparent border-1 border-red-400 text-red-400 hover:text-red-500 hover:bg-transparent hover:border-red-600 cursor-pointer"
              onClick={() => {
                const response = signOut();

              }}
            >
              Log Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
