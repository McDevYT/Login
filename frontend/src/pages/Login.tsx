import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-8 rounded w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <div>
          <label className="block text-sm font-medium">Username:</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            type="text"
            id="fname"
            name="fname"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password:</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            type="text"
            id="lname"
            name="lname"
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
          Already have an account?{" "}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
