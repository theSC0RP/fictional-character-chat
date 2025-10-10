import "@/App.css";
import Chat from "./views/Chat";
import Home from "./views/Home";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import { Route, Routes } from "react-router-dom";
import { CharactersContextProvider } from "./context/CharactersContext";
import { ChatContextProvider } from "./context/ChatContext";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/sign-in"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <CharactersContextProvider>
              <ChatContextProvider>
                <Chat />
              </ChatContextProvider>
            </CharactersContextProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
