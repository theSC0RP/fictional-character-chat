from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from app.repositories.chat_repository import clear_character_chat_history, get_character_chat_history
from app.dependencies.auth import verify_jwt_and_get_user
from app.api.consts import CHAT_HISTORY_API_PREFIX
from bson import ObjectId

router = APIRouter(prefix=CHAT_HISTORY_API_PREFIX, tags=["ChatHistory"])

@router.get("/{character_id}")
async def get_history(
  character_id: str,
  limit: Optional[int] = Query(default=40, ge=1, le=500),
  user = Depends(verify_jwt_and_get_user)
):
  """
  Returns most recent `limit` messages (user/assistant) for a character,
  plus character/universe metadata.
  """
  user_id = user.get("id")
  doc = await get_character_chat_history(user_id=user_id, character_id=character_id, limit=limit)
  if not doc:
    return {"user_id": user_id, "character_id": character_id, "character": None, "universe": None, "messages": []}
  
  return doc

@router.delete("/{character_id}")
async def clear_history(
  character_id: str,
  user = Depends(verify_jwt_and_get_user)
):
  """
  Clears chat history with a character
  """
  try:
    user_id = user.get("id") if user else None
    
    docs_updated = await clear_character_chat_history(user_id, character_id)
    if docs_updated == 0:
      raise Exception("Could not clear chat history")
  except Exception as e:
    return HTTPException(status_code=500, detail="Could not clear chat history")

  return {"message": "Chat history cleared successfully"}

