import { UNPROCESSABLE_ENTITY, FORBIDDEN, UNAUTHORIZED } from 'http-status';

import { Roles } from '../constants/Roles';
import { User as UserDAO } from '../models';
import ResponseError from '../utils/ResponseError';
import { generateToken } from '../utils/jwt';
import { UserModel } from 'models/User';

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

type UserWithoutPassword = Omit<IUser, 'password'>;

export async function createNewUser(params: IUser): Promise<UserWithoutPassword> {
  const instance: UserModel = await UserDAO.create(params);

  const user = instance.get({ plain: true }) as IUser;
  delete user.password;

  return user;
}

export async function updateUser(id: number, params: Partial<UserWithoutPassword>): Promise<UserWithoutPassword> {
  const result = await UserDAO.update(params, { where: { id } });

  if (!result || !result[0]) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }

  const instance: UserModel | null = await UserDAO.findByPk(id, { attributes: { exclude: ['password'] } });
  const user = instance!.get({ plain: true }) as UserWithoutPassword;

  return user;
}

export async function deleteUser(id: number): Promise<void> {
  const deleted: number = await UserDAO.destroy({ where: { id } });
  if (deleted <= 0) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }
}

export async function updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
  const instance: UserModel | null = await UserDAO.findByPk(id);
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
  const instance: UserModel | null = await UserDAO.findOne({
    where: { email, password },
    attributes: { exclude: ['password'] },
  });

  if (!instance) {
    throw new ResponseError(UNAUTHORIZED, 'E-mail or password incorrect');
  }

  const user = instance.get({ plain: true }) as UserWithoutPassword & { id: number };
  const token = await generateToken(user.id);

  return token;
}
