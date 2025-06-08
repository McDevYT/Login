import { Navigate } from "react-router-dom";
import { useDataContext } from "./DataContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactElement;
}) {
  const { accessToken } = useDataContext();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}
