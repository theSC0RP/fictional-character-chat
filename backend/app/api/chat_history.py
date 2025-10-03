from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.repository import get_session_history

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
  doc = await get_session_history(user_id=user_id, character_id=character_id, limit=limit)
  if not doc:
    # Return an empty session structure so the FE can render cleanly
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

  