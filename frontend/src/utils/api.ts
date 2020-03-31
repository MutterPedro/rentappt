import axios from "axios";

import { IUser } from "../types/user";
import { saveSession } from "./session";

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:3000";

export async function userLogin(
  email: string,
  password: string
): Promise<IUser> {
  const url = `${endpoint}/user/login`;

  console.log({ endpoint, url });

  const { data } = await axios.post<{ token: string; user: IUser }>(url, {
    email,
    password
  });
  saveSession(data.token);

  return data.user;
}

export async function userSignUp(user: IUser) {
  const url = `${endpoint}/user`;

  const { data: token } = await axios.post(url, user);
  saveSession(token);
}
