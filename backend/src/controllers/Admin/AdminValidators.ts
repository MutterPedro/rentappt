import joi from '@hapi/joi';

import { Roles } from '../../constants/Roles';

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  birth?: Date;
  phone: string;
  role: Roles;
}

export const UserCreateValidator = joi.object({
  name: joi.string().required(),
  email: joi
    .string()
    .email()
    .required(),
  password: joi
    .string()
    .alphanum()
    .min(6)
    .required(),
  birth: joi.date(),
  phone: joi
    .string()
    .pattern(new RegExp('^[0-9]{11,15}$'))
    .required(),
  role: joi
    .number()
    .min(Roles.Client)
    .max(Roles.Admin)
    .required(),
});

export interface IUserUpdate extends Partial<IUserCreate> {
  id: number;
}

export const UserUpdateValidator = joi.object({
  id: joi.number().required(),
  name: joi.string(),
  email: joi.string().email(),
  password: joi
    .string()
    .alphanum()
    .min(6),
  birth: joi.date(),
  phone: joi.string().pattern(new RegExp('^[0-9]{11,15}$')),
  role: joi
    .number()
    .min(Roles.Client)
    .max(Roles.Admin),
});

export interface IUserDelete {
  id: number;
}

export const UserDeleteValidator = joi.object({
  id: joi.number().required(),
});

export interface IUserList {
  offset?: number;
  limit?: number;
  role?: Roles;
}

export const UserListValidator = joi.object({
  offset: joi.number().min(0),
  limit: joi.number().min(1),
  role: joi
    .number()
    .min(Roles.Client)
    .max(Roles.Admin),
});
