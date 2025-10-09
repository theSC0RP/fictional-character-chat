# app/core/security.py

from datetime import datetime, timedelta, timezone
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from app.core.config import (
  JWT_SECRET_KEY,
  JWT_ALGORITHM,
  ACCESS_TOKEN_EXPIRE_MINUTES,
  REFRESH_TOKEN_EXPIRE_DAYS,
)

# Initialize password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
  """Hash a plain password using bcrypt."""
  return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
  """Verify a plain password against its hashed version."""
  return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_data: dict) -> str:
  """
  Create a JWT access token with short expiry.
  user_data should contain the user info you want to include in payload
  e.g., id, email, first_name, last_name
  """
  to_encode = user_data.copy()
  expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  to_encode.update({"exp": expire, "type": "access"})
  return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
  """
  Create a JWT refresh token with long expiry.
  Minimal payload: only user id (sub)
  """
  to_encode = {"sub": user_id, "type": "refresh"}
  expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
  to_encode.update({"exp": expire})
  return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
  """Decode a JWT token and return its payload if valid."""
  try:
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    return payload
  except ExpiredSignatureError:
    # Token has expired
    print("Error decoding token: ExpiredSignatureError")
    return None
  except InvalidTokenError:
    # Token is malformed or invalid
    print("Error decoding token: InvalidTokenError")
    return None
