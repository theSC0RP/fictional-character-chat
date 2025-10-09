# app/dependencies/auth.py

from fastapi import HTTPException, Request
from app.core.security import decode_token
from app.repositories.auth_repository import get_user_by_id

async def verify_jwt_and_get_user(request: Request):
  access_token = request.cookies.get("access_token") or \
    request.headers.get("Authorization", "").replace("Bearer ", "")

  if not access_token:
    raise HTTPException(status_code=401, detail="Unauthorized request")

  payload = decode_token(access_token)
  if not payload or payload.get("type") != "access":
    raise HTTPException(status_code=401, detail="Invalid or expired access token")

  user_id = payload.get("sub")
  user = await get_user_by_id(user_id)
  if not user:
    raise HTTPException(status_code=401, detail="User not found")

  return user
