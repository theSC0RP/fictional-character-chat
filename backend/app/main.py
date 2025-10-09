from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat_ws import router as chat_ws_router
from app.api.chat_history import router as chat_history_router
from app.api.health_check import router as health_check_router
from app.api.auth import router as auth_router

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

# Mount the router
app.include_router(health_check_router)
app.include_router(auth_router)
app.include_router(chat_ws_router)
app.include_router(chat_history_router)