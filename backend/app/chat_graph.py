from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langchain_core.runnables import RunnableLambda
from typing import TypedDict, List
import os
from langchain_ollama import ChatOllama

ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

llm = ChatOllama(
  model="llama3.2",
  base_url=ollama_url,
  temperature=0.7
)


# Optional: Make these dynamic later
character = "Yoda"
universe = "Star Wars"


# 1️⃣ Define the shape of the state
class ChatState(TypedDict):
  input: str
  messages: List[dict]
  output: str


# 2️⃣ Define the graph
def create_chat_graph(character: str, universe: str):
  # LangChain prompt with dynamic character/universe + memory
  prompt = ChatPromptTemplate.from_messages([
    ("system",
      "You are roleplaying as **{character}** from the **{universe}** universe. "
      "Speak in character. Do not simulate a conversation. "
      "Only reply with what {character} would say next."),
    MessagesPlaceholder("messages"),
    ("user", "{input}")
  ])

  # Local LLM from Ollama
  llm = ChatOllama(
    model="llama3.2",
    base_url=ollama_url,
    temperature=0.7
  )

  # Simple chain: prompt → LLM
  chain = prompt | llm

  # Node that updates state and returns response
  def reply_node(state: ChatState) -> ChatState:
    input_msg = state["input"]
    messages = state.get("messages", [])
    messages.append({"role": "user", "content": input_msg})

    # Generate response
    response = chain.invoke({
      "character": character,
      "universe": universe,
      "input": input_msg,
      "messages": messages
    })

    messages.append({"role": "assistant", "content": response})

    return {
      "input": input_msg,
      "messages": messages,
      "output": response
    }

  # Create the graph with state schema
  builder = StateGraph(ChatState)
  builder.add_node("chat", RunnableLambda(reply_node))
  builder.set_entry_point("chat")
  builder.add_edge("chat", END)

  # Compile and return LangGraph instance
  return builder.compile()