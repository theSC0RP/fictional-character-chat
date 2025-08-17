# File: backend/app/db.py

import os
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017")
client = AsyncIOMotorClient(MONGO_URL)

# Database and collection
db = client["fictional_chat"]
chat_sessions = db["chat_sessions"]