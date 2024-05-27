import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { NodePropsTypes } from "../types/types";

export default function PublicRoute({ children }: NodePropsTypes) {
  const isLoggedIn = useAuth();
  return !isLoggedIn ? children : <Navigate to="/teams" />;
}
