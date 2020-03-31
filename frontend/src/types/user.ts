import { Roles } from "../constants/Roles";

export interface IUser {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  email: string;
  password: string;
  birth?: Date;
  phone: string;
  role: Roles;
}
