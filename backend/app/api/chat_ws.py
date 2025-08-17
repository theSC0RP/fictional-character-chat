from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.connection_manager import manager
from app.services.chat_service import process_chat_message

router = APIRouter()


@router.websocket("/chat/{user_id}/{session_id}")
async def websocket_chat(
  ws: WebSocket,
  user_id: str,
  session_id: str
):
  await manager.connect(session_id, ws)
  print(session_id, user_id)
  try:
    print("\n\n Here \n\n")
    while True:
      payload = await ws.receive_json()
      print("Payload: ", payload)
      result = await process_chat_message(
        redis=manager.redis,
        user_id=user_id,
        session_id=session_id,
        character=payload["character"],
        universe=payload["universe"],
        user_input=payload["input"],
        max_history=manager.max_history
      )
      await manager.send_personal(ws, result)
  except WebSocketDisconnect:
    manager.disconnect(session_id, ws)