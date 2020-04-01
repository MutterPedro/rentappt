import { Op, WhereAttributeHash } from 'sequelize';
import { UNPROCESSABLE_ENTITY } from 'http-status';

import { User, Apartment as ApartmentDAO } from '../models';
import ResponseError from '../utils/ResponseError';
import { IUser } from './user';

export interface IApartment {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  name: string;
  description: string;
  floorAreaSize: number;
  rentPrice: number;
  rooms: number;
  latitude: number;
  longitude: number;
  available: boolean;
  realtorId: number;
  realtor?: IUser;
}

type ApartmentParam = Omit<IApartment, 'id' | 'updatedAt' | 'createdAt' | 'realtor'>;

interface ApartmentFilter {
  size?: [number, number];
  price?: [number, number];
  rooms?: [number, number];
  available?: boolean;
  limit?: number;
  offset?: number;
}
export async function listApartments(filter: ApartmentFilter = {}): Promise<{ list: IApartment[]; total: number }> {
  const where: WhereAttributeHash = {};
  if (filter.size) {
    where.floorAreaSize = {
      [Op.gte]: filter.size[0],
      [Op.lte]: filter.size[1],
    };
  }
  if (filter.price) {
    where.price = {
      [Op.gte]: filter.price[0],
      [Op.lte]: filter.price[1],
    };
  }
  if (filter.rooms) {
    where.rooms = {
      [Op.gte]: filter.rooms[0],
      [Op.lte]: filter.rooms[1],
    };
  }
  if (filter.available !== undefined) {
    where.available = filter.available;
  }

  const result = await ApartmentDAO.findAndCountAll({
    where,
    include: [{ model: User, attributes: { exclude: ['password'] }, as: 'realtor' }],
    limit: Number(filter.limit || 20),
    offset: Number(filter.offset || 0),
  });

  return {
    list: result.rows.map(instance => instance.get({ plain: true }) as IApartment),
    total: result.count,
  };
}

export async function createNewApartment(data: ApartmentParam): Promise<IApartment> {
  const instance = await ApartmentDAO.create(data);
  const apartment = instance.get({ plain: true }) as IApartment;

  return apartment;
}

export async function updateApartment(
  id: number,
  data: Partial<Omit<ApartmentParam, 'realtorId'>>
): Promise<IApartment> {
  const result = await ApartmentDAO.update(data, { where: { id } });
  if (!result || !result[0]) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "apartment" with the given ID');
  }

  const instance = await ApartmentDAO.findByPk(id);
  const apartment = instance!.get({ plain: true }) as IApartment;

  return apartment;
}

export async function deleteApartment(id: number): Promise<void> {
  const deleted: number = await ApartmentDAO.destroy({ where: { id } });
  if (deleted <= 0) {
    throw new ResponseError(UNPROCESSABLE_ENTITY, 'Unable to find an "apartment" with the given ID');
  }
}
