// // src/lib/api.ts

// import { API_BASE, USER_ID } from '../constants'
// import type { Message } from '../../types'
// import axios from 'axios'

// export async function fetchCharacterChatHistory(characterId: string, limit = 40): Promise<Message[]> {
//   try {
//     const res = await axios.get(`${API_BASE}/history/${USER_ID}/${characterId}`, {
//       params: { limit }
//     })

//     if (res.status != 200) {
//       throw Error("Could not fetch history from server.")
//     }

//     const data = res.data
//     return (data.messages ?? [])
//       .filter(
//         (m: any) =>
//           m &&
//           (m.role === "user" || m.role === "assistant") &&
//           typeof m.content === "string"
//       )
//       .map((m: any) => ({ role: m.role, content: m.content }))
//   } catch (error) {
//     console.error("Error fetching history:", error)
//     return []
//   }
// }

// export async function clearCharacterChatHistory(characterId: string): Promise<boolean> {
//   try {
//     const res = await axios.delete(`${API_BASE}/history/${USER_ID}/${characterId}`);

//     if (res.status !== 200) {
//       throw Error("Could not clear character history")
//     }

//     return true
//   } catch (error) {
//     console.log("Error clearing history: ", error)
//     return false
//   }
// }

import axiosInstance from './axiosInstance'
import type { Message } from '@/types'
import { CHAT_HISTORY_API_PREFIX, USER_ID } from '../constants'

export async function fetchCharacterChatHistory(characterId: string, limit = 40): Promise<Message[]> {
  const res = await axiosInstance.get(`${CHAT_HISTORY_API_PREFIX}/${USER_ID}/${characterId}`, { params: { limit } })
  return (res.data.messages ?? [])
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m: any) => ({ role: m.role, content: m.content }))
}

export async function clearCharacterChatHistory(characterId: string): Promise<boolean> {
  await axiosInstance.delete(`${CHAT_HISTORY_API_PREFIX}/${USER_ID}/${characterId}`)
  return true
}
