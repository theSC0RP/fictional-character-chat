import { useEffect, useRef, useState } from 'react'
import { USER_ID } from '../lib/constants'

export function useChatSocket(characterId: string, onAssistant: (delta: string) => void) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // if (wsRef.current) {
    //   wsRef.current.close()
    //   wsRef.current = null
    //   setConnected(false)
    // }

    const socket = new WebSocket(`ws://localhost:8000/chat/${USER_ID}/${characterId}`)
    wsRef.current = socket

    socket.onopen = () => setConnected(true)
    socket.onerror = () => setConnected(false)
    socket.onclose = () => {
      setConnected(false)
      wsRef.current = null
    }
    socket.onmessage = ev => {
      try {
        const data = JSON.parse(ev.data)
        onAssistant(String(data.response ?? ''))
      } catch {}
    }

    // return () => socket.close()
  }, [characterId, onAssistant])

  const send = (payload: any) => {
    if (!connected || !wsRef.current) return
    wsRef.current.send(JSON.stringify(payload))
  }

  return { send, connected }
}