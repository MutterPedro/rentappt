import { Sequelize } from 'sequelize';

import { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER } from '../utils/environment';

export default class DB {
  private static Connection?: Sequelize;

  public static getInstance(): Sequelize {
    if (!DB.Connection) {
      DB.Connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
      });
    }

    return DB.Connection;
  }

  public async closeConnection(): Promise<void> {
    if (DB.Connection) {
      await DB.Connection.close();
    }
  }
}
