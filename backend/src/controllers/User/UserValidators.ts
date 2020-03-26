import joi from '@hapi/joi';
import { Roles } from '../../constants/Roles';

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  birth?: Date;
  phone: string;
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
});

export interface IUserUpdate extends Partial<Omit<IUserCreate, 'password'>> {
  role?: Roles;
  id: number;
}

export const UserUpdateValidator = joi.object({
  id: joi.number().required(),
  name: joi.string(),
  email: joi.string().email(),
  birth: joi.date(),
  phone: joi.string().pattern(new RegExp('^[0-9]{11,15}$')),
  roles: joi.options([Roles.Client, Roles.Realtor, Roles.Admin]),
});

export interface IUserDelete {
  id: number;
}

export const UserDeleteValidator = joi.object({
  id: joi.number().required(),
});

export interface IUpdatePassword {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export const UpdatePasswordValidator = joi.object({
  id: joi.number().required(),
  oldPassword: joi.string().required(),
  newPassword: joi.string().required(),
});

export interface IUserLogin {
  email: string;
  password: string;
}

export const UserLoginValidator = joi.object({
  email: joi
    .string()
    .email()
    .required(),
  password: joi
    .string()
    .alphanum()
    .min(6)
    .required(),
});
