import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { ReactElement } from "react"

type IPublicRouteProps = {
  children: ReactElement 
}
export default function PublicRoute({ children }: IPublicRouteProps) {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated: ", isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  return children;
}
