import { UNPROCESSABLE_ENTITY, FORBIDDEN, NOT_FOUND } from 'http-status';

import { Roles } from '../constants/Roles';
import { User as UserDAO } from '../models';
import ResponseError from '../utils/ResponseError';
import { generateToken } from '../utils/jwt';

export interface IUser {
  name: string;
  email: string;
  password: string;
  birth?: Date;
  phone: string;
  role: Roles;
}

type UserWithoutPassword = Omit<IUser, 'password'>;

export async function createNewUser(params: IUser): Promise<UserWithoutPassword> {
  const instance: UserDAO = await UserDAO.create(params);

  const user = instance.get({ plain: true }) as IUser;
  delete user.password;

  return user;
}

export async function updateUser(id: number, params: Partial<UserWithoutPassword>): Promise<UserWithoutPassword> {
  const result = await UserDAO.update(params, { where: { id } });

  if (!result || !result[0]) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }

  const instance: UserDAO = await UserDAO.findByPk(id, { attributes: { exclude: ['password'] } });
  const user = instance.get({ plain: true }) as UserWithoutPassword;

  return user;
}

export async function deleteUser(id: number): Promise<void> {
  const deleted: number = await UserDAO.destroy({ where: { id } });
  if (deleted <= 0) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }
}

export async function updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
  const instance: UserDAO = await UserDAO.findByPk(id);
  if (!instance) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }
  const user = instance.get({ plain: true }) as IUser;

  if (user.password !== oldPassword) {
    throw new ResponseError(FORBIDDEN, 'Current password provided is not correct');
  }

  await UserDAO.update({ password: newPassword }, { where: { id } });
}

export async function loginUser(email: string, password: string): Promise<string> {
  const instance: UserDAO = await UserDAO.findOne({
    where: { email, password },
    attributes: { exclude: ['password'] },
  });
  if (!instance) {
    throw new ResponseError(NOT_FOUND, 'E-mail or password incorrect');
  }

  const user = instance.get({ plain: true }) as UserWithoutPassword & { id: number };
  const token = await generateToken(user.id);

  return token;
}
