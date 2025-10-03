from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.repository import clear_character_chat_history, get_character_chat_history

router = APIRouter()

@router.get("/history/{user_id}/{character_id}")
async def get_history(
  user_id: str,
  character_id: str,
  limit: Optional[int] = Query(default=40, ge=1, le=500)
):
  """
  Returns most recent `limit` messages (user/assistant) for a character,
  plus character/universe metadata.
  """
  doc = await get_character_chat_history(user_id=user_id, character_id=character_id, limit=limit)
  if not doc:
    return {"user_id": user_id, "character_id": character_id, "character": None, "universe": None, "messages": []}
  
  return doc

@router.patch("/history/{user_id}/{character_id}")
async def clear_history(
  user_id: str,
  character_id: str
):
  """
  Clears chat history with a character
  """
  try:
    docs_updated = await clear_character_chat_history(user_id, character_id)
    if docs_updated == 0:
      raise Exception("Could not clear chat history")
  except Exception as e:
    return HTTPException(status_code=500, detail="Could not clear chat history")

  return {"message": "Chat history cleared successfully"}

