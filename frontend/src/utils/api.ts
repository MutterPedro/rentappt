import axios from "axios";

import { IUser } from "../types/user";
import { IApartment, IApartmentFilter } from "../types/apartment";
import { saveSession, saveUserSession, getSessionToken } from "./session";
import { API_ENDPOINT } from "./environment";

const endpoint = API_ENDPOINT || "http://localhost:3000";

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

export async function userListApartment(
  filters: IApartmentFilter,
  roleName: "user" | "realtor" = "user"
): Promise<IApartment[]> {
  const url = `${endpoint}/${roleName}/apartments`;

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
    params,
    headers: {
      Authorization: `Bearer ${getSessionToken()}`
    }
  });

  return data.list;
}

export async function realtorCreateApartment(
  ap: IApartment
): Promise<IApartment> {
  const url = `${endpoint}/realtor/apartment`;

  const { data } = await axios.post<IApartment>(url, ap, {
    headers: {
      Authorization: `Bearer ${getSessionToken()}`
    }
  });

  return data;
}

export async function realtorUpdateApartment(
  ap: Partial<IApartment>
): Promise<IApartment> {
  const url = `${endpoint}/realtor/apartment`;
  delete ap.available;
  delete ap.createdAt;
  delete ap.updatedAt;
  delete ap.realtorId;
  delete ap.realtor;

  const { data } = await axios.put<IApartment>(url, ap, {
    headers: {
      Authorization: `Bearer ${getSessionToken()}`
    }
  });

  return data;
}

export async function realtorDeleteApartment(id: number): Promise<void> {
  const url = `${endpoint}/realtor/apartment`;

  await axios.delete(url, {
    data: { id },
    headers: {
      Authorization: `Bearer ${getSessionToken()}`
    }
  });
}

export async function realtorSetApartmentAsRent(id: number): Promise<void> {
  const url = `${endpoint}/realtor/rent`;

  await axios.patch(
    url,
    { id, available: false },
    {
      headers: {
        Authorization: `Bearer ${getSessionToken()}`
      }
    }
  );
}
