export function saveSession(token: string) {
  localStorage.setItem("sessionToken", token);
}

export function getSessionToken(): string | null {
  return localStorage.getItem("sessionToken");
}
