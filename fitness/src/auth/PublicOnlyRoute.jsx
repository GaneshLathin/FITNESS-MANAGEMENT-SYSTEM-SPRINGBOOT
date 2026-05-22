import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicOnlyRoute = () => {
  const { auth } = useAuth();

  return auth?.token ? (
    <Navigate to={`/${auth.role.toLowerCase()}`} />
  ) : (
    <Outlet />
  );
};

export default PublicOnlyRoute;
