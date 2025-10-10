import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { CharactersContextProvider } from "./context/CharactersContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CharactersContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatContextProvider>
    </CharactersContextProvider>
  </StrictMode>
);
