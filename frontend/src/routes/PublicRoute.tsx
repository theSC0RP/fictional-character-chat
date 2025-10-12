import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { ReactElement } from "react"

type IPublicRouteProps = {
  children: ReactElement 
}
export default function PublicRoute({ children }: IPublicRouteProps) {
  const { isAuthenticated } = useAuth();

  const isAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up"

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/chat" replace />
  }

  return children;
}
