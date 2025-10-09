from fastapi import APIRouter, HTTPException, Depends, Request, Response

router = APIRouter()

@router.get("/ping")
def health_check():
  return "pong"