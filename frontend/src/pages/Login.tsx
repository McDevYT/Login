import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../auth";
import { useDataContext } from "../DataContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const context = useDataContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await login(username, password);
    if (token) {
      context.setAccessToken(token);
      context.setUsername(username);
      navigate("/home");
    } else {
      alert("login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <div>
          <label className="block text-sm font-medium">Username:</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            type="text"
            id="fname"
            name="fname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password:</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            type="password"
            id="lname"
            name="lname"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
