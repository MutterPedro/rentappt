import { Model, STRING, INTEGER, TEXT, FLOAT, BOOLEAN, Association } from 'sequelize';

import DB from '../config/DB';
import User from './User';

class Apartment extends Model {
  public id!: number;

  public name!: string;
  public description!: string;
  public floorAreaSize!: number;
  public rentPrice!: number;
  public rooms!: number;
  public latitude!: number;
  public longitude!: number;
  public available!: boolean;
  public realtorId!: number;
  public realtor?: User;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    realtor: Association<Apartment, User>;
  };
}
Apartment.init(
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: false },
    floorAreaSize: { type: FLOAT, allowNull: false },
    rentPrice: { type: FLOAT, allowNull: false },
    rooms: { type: INTEGER, allowNull: false },
    latitude: { type: FLOAT, allowNull: false },
    longitude: { type: FLOAT, allowNull: false },
    available: { type: BOOLEAN, allowNull: false },
  },
  {
    sequelize: DB.getInstance(),
    modelName: 'apartment',
  }
);

Apartment.belongsTo(User, { foreignKey: 'realtorId' });
User.hasMany(Apartment, { foreignKey: 'realtorId' });

export default Apartment;
