import axiosInstance from './axiosInstance'
import type { SignInRequest, SignUpRequest } from '@/types'
import {AUTH_API_PREFIX} from "../constants"

// Sign-up API
export async function signUp(payload: SignUpRequest) {
  try {
    const res = await axiosInstance.post(`${AUTH_API_PREFIX}/sign-up`, payload)
    return res
  } catch (error: any) {
    console.error('Sign-up error:', error.response?.data || error.message)
    throw error
  }
}

// Sign-in API
export async function signIn(payload: SignInRequest) {
  try {
    const res = await axiosInstance.post(`${AUTH_API_PREFIX}/sign-in`, payload)
    return res
  } catch (error: any) {
    console.error('Sign-in error:', error.response?.data || error.message)
    throw error
  }
}

// Sign-out API
export async function signOut() {
  try {
    const res = await axiosInstance.post(`${AUTH_API_PREFIX}/sign-out`)
    return res
  } catch (error: any) {
    console.error('Sign-out error:', error.response?.data || error.message)
    throw error
  }
}

// Get user info
export async function getCurrentUser() {
  try {
    const res = await axiosInstance.get(`${AUTH_API_PREFIX}/me`)
    return res
  } catch (error: any) {
    console.error('Get current user error:', error.response?.data || error.message)
    return null
  }
}
