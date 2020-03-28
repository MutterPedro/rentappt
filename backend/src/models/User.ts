import { Model, STRING, INTEGER, DATE, BuildOptions } from 'sequelize';

import DB from '../config/DB';
import { Roles } from '../constants/Roles';

export interface UserModel extends Model {
  readonly id: number;
  name: string;
  email: string;
  password: string;
  birth?: Date;
  phone: string;
  role: Roles;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

const User = DB.getInstance().define(
  'user',
  {
    id: {
      primaryKey: true,
      type: INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    name: { type: STRING, allowNull: false },
    email: { type: STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: STRING, allowNull: false, validate: { min: 6, isAlphanumeric: true } },
    birth: {
      type: DATE,
      allowNull: true,
      validate: {
        isPast(value: string) {
          if (new Date(value).getTime() > Date.now()) {
            throw new Error('Birthday must be on the past');
          }
        },
      },
    },
    phone: { type: STRING, allowNull: false, validate: { len: [10, 15], isNumeric: true } },
    role: { type: INTEGER, allowNull: false, validate: { isIn: { args: [Object.keys(Roles)], msg: 'Invalid role' } } },
  },
  {
    indexes: [{ unique: true, fields: ['email', 'password'] }],
  }
) as UserModelStatic;

export default User;
