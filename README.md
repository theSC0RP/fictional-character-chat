# Fictional Chat

Fictional Chat is a web application that lets you carry on conversations with your favorite fictional characters. It uses a locally hosted LLM (llama3.2) served via Ollama within Docker containers, ensuring privacy and full control over the model.

## Features

- **Character-based chat**: Select from predefined characters or add your own.  
- **Custom character management**: Add, delete, and persist characters in `localStorage`.  
- **Modern UI**: Built with React, TypeScript, Headless UI, and Tailwind CSS for a responsive and accessible interface.  
- **Local LLM hosting**: Host `llama3.2` locally 

## Prerequisites

- Docker Engine (20.10+)
- Ollama CLI (`ollama` command)
- `llama3.2` model downloaded via Ollama
- Node.js (v16+) and npm or yarn

## Quick Start

**1. Clone the repository**  
  ```bash
  git clone https://github.com/your-org/fictional-chat.git
  cd fictional-chat
  ```

**2. Pull the LLM model**
  ```bash
  ollama pull llama3.2
  ```

**3. Build and start containers** 
  ```bash
  docker-compose up --build
  ```

**4.	Serve the model**
  ```bash
  ollama serve
  ```

**5.	Open in browser**
  Navigate to http://localhost:3000 to begin chatting.


**6. Configuration**
1. API Endpoint: The frontend expects the chat API at http://localhost:8000/chat.
To change this, update the axios.post URL in `src/App.tsx` or set an environment variable.

2. Ollama serves on port 11434 by default.
3. Frontend runs on port 3000.

Adjust ports in `docker-compose.yml` or `vite.config.ts` as needed.
