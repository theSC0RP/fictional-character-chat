import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CharactersContextProvider } from "./context/CharactersContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CharactersContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </CharactersContextProvider>
  </StrictMode>
);
