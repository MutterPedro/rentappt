import { Model, STRING, INTEGER, TEXT, FLOAT, BOOLEAN, Association, BuildOptions } from 'sequelize';

import DB from '../config/DB';
import User, { UserModel } from './User';

export interface ApartmentModel extends Model {
  readonly id: number;
  name: string;
  description: string;
  floorAreaSize: number;
  rentPrice: number;
  rooms: number;
  latitude: number;
  longitude: number;
  available: boolean;
  realtorId: number;
  realtor?: UserModel;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type ApartmentModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ApartmentModel;
  associations: {
    realtor: Association<ApartmentModel, UserModel>;
  };
};

const Apartment = DB.getInstance().define('apartment', {
  id: {
    primaryKey: true,
    type: INTEGER.UNSIGNED,
    autoIncrement: true,
  },
  name: { type: STRING, allowNull: false },
  description: { type: TEXT, allowNull: false },
  floorAreaSize: { type: FLOAT, allowNull: false },
  rentPrice: { type: FLOAT, allowNull: false },
  rooms: { type: INTEGER, allowNull: false },
  latitude: { type: FLOAT, allowNull: false },
  longitude: { type: FLOAT, allowNull: false },
  available: { type: BOOLEAN, allowNull: false },
}) as ApartmentModelStatic;

Apartment.belongsTo(User, { foreignKey: 'realtorId' });
User.hasMany(Apartment, { foreignKey: 'realtorId' });

export default Apartment;
