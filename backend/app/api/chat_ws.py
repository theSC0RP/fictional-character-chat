from app.dependencies.auth import verify_jwt_and_get_user_ws
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.connection_manager import manager
from app.services.chat_service import process_chat_message

router = APIRouter()


@router.websocket("/chat/{character_id}")
async def websocket_chat(
  ws: WebSocket,
  character_id: str,
  user = Depends(verify_jwt_and_get_user_ws)
):
  await manager.connect(character_id, ws)
  
  try:
    while True:
      payload = await ws.receive_json()
      user_id = user.get("id") if user else None
      
      if not user_id:
        await manager.send_personal(ws, {"error": "User not found"})
        continue 

      result = await process_chat_message(
        redis=manager.redis,
        user_id=user_id,
        character_id=character_id,
        character=payload["character"],
        universe=payload["universe"],
        user_input=payload["input"],
        ai_model=payload["ai_model"],
        max_history=manager.max_history
      )

      await manager.send_personal(ws, result)
    
  except WebSocketDisconnect:
    manager.disconnect(character_id, ws)
  except Exception as e:
    print("WebSocket error:", e)
    try:
      await ws.close()
    except Exception:
      pass