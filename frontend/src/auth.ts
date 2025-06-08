import { useDataContext } from "./DataContext";

export const login = async (
  username: string,
  password: string
): Promise<string | null> => {
  const response = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  }
  return null;
};

export const register = async (
  username: string,
  password: string
): Promise<boolean> => {
  const response = await fetch("http://localhost:3000/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return response.ok;
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch("http://localhost:3000/user/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (res.ok) {
    const data = await res.json();
    return data.accessToken;
  } else {
    throw new Error("Refresh token invalid");
  }
};

export const getUser = async (token: string): Promise<string | null> => {
  const response = await fetch("http://localhost:3000/getuser", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Request failed:", response.status);
    return null;
  }

  const data = await response.json();
  return data.username;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (refreshToken) {
    await fetch("http://localhost:3000/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });
  }

  localStorage.removeItem("refreshToken");
};
