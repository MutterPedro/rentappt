import DB from '../config/DB';

export { default as User } from './User';
export { default as Apartment } from './Apartment';

export const init = async (force = false) => {
  await DB.getInstance().sync({ force });
};
