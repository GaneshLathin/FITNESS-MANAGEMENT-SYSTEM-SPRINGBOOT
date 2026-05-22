// auth/RoleBasedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RoleBasedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/" replace />; // Not logged in
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />; // Unauthorized
  }

  return <Outlet />; // Authorized → render children
};

export default RoleBasedRoute;
