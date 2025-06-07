import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch("http://localhost:3000/users/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } else {
    throw new Error("Refresh token invalid");
  }
};

function App() {
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.warn("User not logged in or refresh token invalid.");
      }
    };

    tryRefresh();
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<Login />} />
    </Routes>
  );
}

export default App;
