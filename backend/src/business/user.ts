import { UNPROCESSABLE_ENTITY, FORBIDDEN, UNAUTHORIZED } from 'http-status';

import { Roles } from '../constants/Roles';
import { User as UserDAO } from '../models';
import ResponseError from '../utils/ResponseError';
import { generateToken } from '../utils/jwt';
import { UserModel } from 'models/User';
import { WhereAttributeHash } from 'sequelize/types';

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

  const user = await getUserById(id, ['password']);

  return user!;
}

export async function deleteUser(id: number): Promise<void> {
  const deleted: number = await UserDAO.destroy({ where: { id } });
  if (deleted <= 0) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }
}

export async function updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
  const user: IUser | null = await getUserById(id);
  if (!user) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "user" with the given ID');
  }

  if (user.password !== oldPassword) {
    throw new ResponseError(FORBIDDEN, 'Current password provided is not correct');
  }

  await UserDAO.update({ password: newPassword }, { where: { id } });
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: UserWithoutPassword }> {
  const instance: UserModel | null = await UserDAO.findOne({
    where: { email, password },
    attributes: { exclude: ['password'] },
  });

  if (!instance) {
    throw new ResponseError(UNAUTHORIZED, 'E-mail or password incorrect');
  }

  const user = instance.get({ plain: true }) as UserWithoutPassword;
  const token = await generateToken(user.id!);

  return { token, user };
}

export async function getUserById(id: number, exclude: (keyof IUser)[] = []): Promise<IUser | null> {
  let instance: UserModel | null;
  if (exclude && exclude[0]) {
    instance = await UserDAO.findByPk(id, { attributes: { exclude } });
  } else {
    instance = await UserDAO.findByPk(id);
  }

  if (instance) {
    return instance.get({ plain: true }) as IUser;
  }

  return null;
}

export async function listUser(
  filter: {
    role?: Roles;
    offset?: number;
    limit?: number;
  } = {}
): Promise<{ list: UserWithoutPassword[]; total: number }> {
  const where: WhereAttributeHash = {};
  if (filter.role) {
    where.role = filter.role;
  }

  const result = await UserDAO.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    offset: Number(filter.offset || 0),
    limit: Number(filter.limit || 20),
  });

  return {
    list: result.rows.map(instance => instance.get({ plain: true }) as UserWithoutPassword),
    total: result.count,
  };
}
