# app/repositories/auth_repository.py

from app.db import db
from app.core.security import hash_password
from bson import ObjectId

users_collection = db["users"]

async def get_user_by_email(email: str):
  return await users_collection.find_one({"email": email})

async def get_user_by_id(user_id: str):
  try:
    oid = ObjectId(user_id)
  except Exception:
    return None  # invalid id

  user = await users_collection.find_one({"_id": oid})
  user["id"] = str(user["_id"])
  del user["_id"]

  return user

async def create_user(first_name: str, last_name: str, email: str, password: str):
  user = {
    "first_name": first_name,
    "last_name": last_name,
    "email": email,
    "password": hash_password(password),
    "refresh_token": None,
  }
  await users_collection.insert_one(user)
  return user

async def update_refresh_token(email: str, refresh_token: str):
  await users_collection.update_one(
    {"email": email},
    {"$set": {"refresh_token": refresh_token}},
  )

async def clear_refresh_token(email: str):
  await users_collection.update_one(
    {"email": email},
    {"$set": {"refresh_token": None}},
  )
