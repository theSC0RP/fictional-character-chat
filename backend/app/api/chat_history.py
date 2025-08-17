from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.repository import get_session_history

router = APIRouter()

@router.get("/history/{user_id}/{session_id}")
async def get_history(
  user_id: str,
  session_id: str,
  limit: Optional[int] = Query(default=40, ge=1, le=500)
):
  """
  Returns most recent `limit` messages (user/assistant) for a session,
  plus character/universe metadata.
  """
  doc = await get_session_history(user_id=user_id, session_id=session_id, limit=limit)
  if not doc:
    # Return an empty session structure so the FE can render cleanly
    return {"user_id": user_id, "session_id": session_id, "character": None, "universe": None, "messages": []}
  return doc