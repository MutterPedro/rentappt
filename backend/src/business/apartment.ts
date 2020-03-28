import { User, Apartment as ApartmentDAO } from '../models';
import { UserModel } from '../models/User';
import { ApartmentModel } from '../models/Apartment';

export interface IApartment {
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
}

export async function listApartments(
  available: boolean,
  limit: number = 20,
  offset: number = 0
): Promise<{ list: IApartment[]; total: number }> {
  const result: { rows: ApartmentModel[]; count: number } = await ApartmentDAO.findAndCountAll({
    where: { available },
    include: [{ model: User, attributes: { exclude: ['password'] } }],
    limit,
    offset,
  });

  return {
    list: result.rows.map(instance => instance.get({ plain: true }) as IApartment),
    total: result.count,
  };
}
