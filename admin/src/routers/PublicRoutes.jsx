import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoutes() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  console.log(isAuthenticated);

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
}
