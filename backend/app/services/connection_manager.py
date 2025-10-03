import os, json
from fastapi import WebSocket
import redis.asyncio as aioredis

class ConnectionManager:
  def __init__(self):
    self.active: dict[str, set[WebSocket]] = {}
    self.redis = aioredis.from_url(
      os.getenv("REDIS_URL", "redis://redis:6379/0"),
      encoding="utf-8", decode_responses=True
    )
    self.max_history = int(os.getenv("MAX_HISTORY", "20"))

  async def connect(self, character_id: str, ws: WebSocket):
    await ws.accept()
    self.active.setdefault(character_id, set()).add(ws)

  def disconnect(self, character_id: str, ws: WebSocket):
    self.active.get(character_id, set()).discard(ws)

  async def send_personal(self, ws: WebSocket, data: dict):
    await ws.send_text(json.dumps(data))


manager = ConnectionManager()