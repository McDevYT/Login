import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useEffect } from "react";
import { getUser, refreshAccessToken } from "./auth";
import { useDataContext } from "./DataContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { setAccessToken, setUsername } = useDataContext();
  const navigate = useNavigate();
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        const username = await getUser(newToken);
        setUsername(username ?? "");
        navigate("/home");
      } catch (err) {
        console.warn("User not logged in or refresh token invalid.");
        navigate("/login");
      }
    };

    tryRefresh();
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<Login />} />
    </Routes>
  );
}

export default App;
