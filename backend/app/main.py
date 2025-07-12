# app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.chat_graph import create_chat_graph

app = FastAPI()

# Enable CORS for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    character: str
    universe: str
    input: str
    messages: list[dict] = []

@app.post("/chat")
async def chat(req: ChatRequest):
  chat_graph = create_chat_graph(req.character, req.universe)
  print("\n\n*** \n, JSON: ", req.input, "\n\n\n")
  result = chat_graph.invoke({"input": req.input, "messages": req.messages})
  return {
    "response": result["output"],
    "messages": result["messages"]
  }