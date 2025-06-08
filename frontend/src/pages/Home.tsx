import { useNavigate } from "react-router-dom";
import { logout } from "../auth";
import { useDataContext } from "../DataContext";

export default function Home() {
  const { username, setAccessToken, setUsername } = useDataContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUsername("");
    setAccessToken(null);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 space-y-4">
      <h1 className="text-2xl font-semibold">Hello, {username}</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
