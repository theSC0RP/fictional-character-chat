# File: backend/app/repository.py

from datetime import datetime
from typing import Optional, Dict, Any
from app.db import chat_sessions

async def log_message(
  user_id: str,
  character_id: str,
  character: str,
  universe: str,
  role: str,
  content: str
) -> None:
  """
  Upsert a chat session document and append a message.
  """
  filter_doc = {"user_id": user_id, "character_id": character_id}
  update = {
    "$setOnInsert": {
      "user_id":   user_id,
      "character_id": character_id,
      "character": character,
      "universe":  universe,
      "created_at": datetime.utcnow()
    },
    "$push": {
      "messages": {
        "role":      role,
        "content":   content,
        "timestamp": datetime.utcnow()
      }
    }
  }
  await chat_sessions.update_one(filter_doc, update, upsert=True)

async def get_character_chat_history(
  user_id: str,
  character_id: str,
  limit: int = 40,
) -> Optional[Dict[str, Any]]:
  """
  Fetch the session document and slice to the last `limit` messages.
  Uses aggregation to avoid pulling huge arrays.
  """
  pipeline = [
    {"$match": {"user_id": user_id, "character_id": character_id}},
    {
      "$project": {
        "_id": 0,
        "user_id": 1,
        "character_id": 1,
        "character": 1,
        "universe": 1,
        "messages": {"$slice": ["$messages", -int(limit)]},
      }
    }
  ]
  cursor = chat_sessions.aggregate(pipeline)
  docs = await cursor.to_list(length=1)
  return docs[0] if docs else None

async def clear_character_chat_history(
  user_id: str,
  character_id: str
):
  """
  Update the document to clear the messages for the character
  """
  filter_doc = {"user_id": user_id, "character_id": character_id}
  update = {
    "$set": {
      "messages": [],
      "updated_at": datetime.utcnow()
    }
  }

  result = await chat_sessions.update_one(filter_doc, update)
  
  return result.matched_count
