# backend/app/chat_graph.py

import os
from typing import List, Optional
from pydantic import BaseModel
from app.api.consts import AI_MODELS
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableLambda

ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

class ChatState(BaseModel):
  input: str
  messages: List[dict]
  output: Optional[str] = None  # allow initial state without output


def create_chat_graph(character: str, universe: str, ai_model: str):
  # Prompt template with memory placeholder
  prompt = ChatPromptTemplate.from_messages([
    ("system",
      "You are roleplaying as **{character}** from the **{universe}** universe. "
      "Speak in character. Talk just the way the character would talk in that universe. Only reply with what {character} would say next."),
      MessagesPlaceholder("messages"),
    ("user", "{input}")
  ])

  llm = ChatOllama(
    model=AI_MODELS[ai_model],
    base_url=ollama_url,
    temperature=0.7
  )

  # Chain: prompt → LLM
  chain = prompt | llm

  def reply_node(state: ChatState) -> ChatState:
  # Start with existing history from Redis
    msgs = list(state.messages or [])
    # Append the new user input
    msgs.append({"role": "user", "content": state.input})

    # Invoke the model; may return an AIMessage
    raw_out = chain.invoke({
      "character": character,
      "universe": universe,
      "input":     state.input,
      "messages":  msgs
    })

    # Extract plain text
    out_text = raw_out.content if hasattr(raw_out, 'content') else str(raw_out)
    # Append assistant response
    msgs.append({"role": "assistant", "content": out_text})

    return ChatState(
      input=state.input,
      messages=msgs,
      output=out_text
    )

  builder = StateGraph(ChatState)
  builder.add_node("chat", RunnableLambda(reply_node))
  builder.set_entry_point("chat")
  builder.add_edge("chat", END)

  return builder.compile()
