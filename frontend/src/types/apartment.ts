import { IUser } from "./user";

export interface IApartment {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  description: string;
  floorAreaSize: number;
  rentPrice: number;
  rooms: number;
  latitude: number;
  longitude: number;
  available: boolean;
  realtorId: number;
  realtor?: IUser;
}

export interface IApartmentFilter {
  size?: number;
  rooms?: number;
  price?: number;
}
