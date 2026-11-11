export interface AuthUser {
  id: string;
  username: string;
}

const API_URL = "http://localhost:5000/api/auth";

export async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to obtain security token.");
  }

  const data = await response.json();
  return data.csrfToken;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to check login status.");
  }

  const data = await response.json();
  return data.user;
}

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data.user;
}

export async function logout(): Promise<void> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}
