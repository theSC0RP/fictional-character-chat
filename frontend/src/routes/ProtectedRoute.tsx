import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { ReactElement } from "react"

type IProtectedRouteProps = {
  children: ReactElement 
}
export default function ProtectedRoute({ children }: IProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />
  }
  return children
}
