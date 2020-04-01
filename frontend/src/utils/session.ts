import { IUser } from "../types/user";

export function saveSession(token: string) {
  localStorage.setItem("sessionToken", token);
}

export function getSessionToken(): string | null {
  return localStorage.getItem("sessionToken");
}

export function saveUserSession(user: IUser) {
  localStorage.setItem("userData", JSON.stringify(user));
}

export function getUserSession(): IUser | null {
  const stringified = localStorage.getItem("userData") || "null";

  return JSON.parse(stringified);
}
