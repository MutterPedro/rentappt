import joi from '@hapi/joi';
import { SESSION } from '../../middlewares/authorization';

export interface IListAvailableApartments {
  size?: [number, number];
  price?: [number, number];
  rooms?: [number, number];
  limit?: number;
  offset?: number;
  available?: boolean;
}

export const ListAvailableApartmentsValidator = joi.object({
  offset: joi.number().min(0),
  limit: joi.number().min(1),
  size: joi
    .array()
    .items(joi.number().min(1))
    .length(2),
  price: joi
    .array()
    .items(joi.number().min(1))
    .length(2),
  rooms: joi
    .array()
    .items(joi.number().min(1))
    .length(2),
  available: joi.boolean(),
});

export interface IApartmentCreate {
  name: string;
  description: string;
  floorAreaSize: number;
  rentPrice: number;
  rooms: number;
  latitude: number;
  longitude: number;
  [SESSION]: number;
}

export const ApartmentCreateValidator = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  floorAreaSize: joi
    .number()
    .required()
    .min(1),
  rentPrice: joi
    .number()
    .required()
    .min(0),
  rooms: joi
    .number()
    .required()
    .min(1),
  latitude: joi.number().required(),
  longitude: joi.number().required(),
  [SESSION]: joi.number().required(),
});

export interface IApartmentUpdate {
  id: number;
  name?: string;
  description?: string;
  floorAreaSize?: number;
  rentPrice?: number;
  rooms?: number;
  latitude?: number;
  longitude?: number;
}

export const ApartmentUpdateValidator = joi.object({
  id: joi.number().required(),
  name: joi.string(),
  description: joi.string(),
  floorAreaSize: joi.number().min(1),
  rentPrice: joi.number().min(0),
  rooms: joi.number().min(1),
  latitude: joi.number(),
  longitude: joi.number(),
});

export interface IApartmentDelete {
  id: number;
}

export const ApartmentDeleteValidator = joi.object({ id: joi.number().required() });

export interface IApartmentRent {
  id: number;
  available: boolean;
}

export const ApartmentRentValidator = joi.object({
  id: joi.number().required(),
  available: joi.boolean().required(),
});
