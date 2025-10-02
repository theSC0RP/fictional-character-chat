import json, uuid
from app.chat_graph import create_chat_graph
from app.repository import log_message

async def process_chat_message(
  redis,
  user_id: str,
  session_id: str,
  character: str,
  universe: str,
  user_input: str,
  ai_model,
  max_history: int
) -> dict:
  # Ensure session_id
  if not session_id:
    session_id = str(uuid.uuid4())

  history_key = f"chat_history:{user_id}:{session_id}"


  # 1) Cache user message in Redis
  await redis.rpush(history_key, json.dumps({"role": "user", "content": user_input}))
  await redis.ltrim(history_key, -max_history * 2, -1)

  # 2) Persist user message in MongoDB
  await log_message(user_id, session_id, character, universe, "user", user_input)

  # 3) Fetch context from Redis
  raw = await redis.lrange(history_key, -max_history * 2, -1)
  history = [json.loads(item) for item in raw]

  # 4) Invoke the LLM graph
  chat_graph = create_chat_graph(character, universe, ai_model)
  result = chat_graph.invoke({"input": user_input, "messages": history})
  raw_out = result["output"]
  out_text = raw_out.content if hasattr(raw_out, "content") else str(raw_out)

  # 5) Cache assistant reply in Redis
  await redis.rpush(history_key, json.dumps({"role": "assistant", "content": out_text}))
  await redis.ltrim(history_key, -max_history * 2, -1)

  # 6) Persist assistant reply in MongoDB
  await log_message(user_id, session_id, character, universe, "assistant", out_text)

  # 7) Return
  return {
    "session_id": session_id,
    "response":   out_text,
    "messages":   result.get("messages", [])
  }