import { Model, STRING, INTEGER, DATE } from 'sequelize';

import DB from '../config/DB';
import { Roles } from '../constants/Roles';

class User extends Model {
  public id!: number;

  public name!: string;
  public email!: string;
  public password!: string;
  public birth?: Date;
  public phone!: string;
  public role!: Roles;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
User.init(
  {
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
    sequelize: DB.getInstance(),
    modelName: 'user',
  }
);

export default User;
