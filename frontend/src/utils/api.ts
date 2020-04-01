import axios from "axios";

import { IUser } from "../types/user";
import { IApartment } from "../types/apartment";
import { saveSession, saveUserSession } from "./session";

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:3000";

export async function userLogin(email: string, password: string) {
  const url = `${endpoint}/user/login`;

  console.log({ endpoint, url });

  const { data } = await axios.post<{ token: string; user: IUser }>(url, {
    email,
    password
  });
  saveSession(data.token);
  saveUserSession(data.user);

  return data.user;
}

export async function userSignUp(user: IUser) {
  const url = `${endpoint}/user`;

  const { data } = await axios.post<{ token: string; user: IUser }>(url, user);
  saveSession(data.token);
  saveUserSession(data.user);

  return data.user;
}

export async function userListApartment(filters: {
  size?: number;
  rooms?: number;
  price?: number;
}): Promise<IApartment[]> {
  const url = `${endpoint}/user/apartments`;

  const params: any = {};
  if (filters.size) {
    params.size = [1, filters.size];
  }
  if (filters.rooms) {
    params.rooms = [1, filters.rooms];
  }
  if (filters.price) {
    params.price = [1, filters.price];
  }

  const { data } = await axios.get<{ list: IApartment[]; total: number }>(url, {
    params
  });

  return data.list;
}
