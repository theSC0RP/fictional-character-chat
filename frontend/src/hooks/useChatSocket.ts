import { WS_API_BASE } from '@/lib/constants'
import { useEffect, useRef, useState } from 'react'

export function useChatSocket(characterId: string, onAssistant: (delta: string) => void) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // if (wsRef.current) {
    //   wsRef.current.close()
    //   wsRef.current = null
    //   setConnected(false)
    // }

    const socket = new WebSocket(`${WS_API_BASE}/chat/${characterId}`)
    wsRef.current = socket

    socket.onopen = () => setConnected(true)
    socket.onerror = () => setConnected(false)
    socket.onclose = () => {
      console.log("Socket closed")
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