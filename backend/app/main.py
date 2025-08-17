from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat_ws import router as chat_ws_router
from app.api.chat_history import router as chat_history_router

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

# Mount the chat WebSocket router
app.include_router(chat_ws_router)
app.include_router(chat_history_router)