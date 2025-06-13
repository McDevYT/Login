import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { getUserData, refreshAccessToken } from "./auth";
import { useDataContext } from "./DataContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { setUsername, accessToken, setAccessToken } = useDataContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = accessToken ? accessToken : await refreshAccessToken();

        setAccessToken(token);

        const userData = await getUserData(token);
        setUsername(userData?.username ?? "");
        navigate("/home");
      } catch (err) {
        console.warn("User not logged in or refresh token invalid.");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return null;

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
