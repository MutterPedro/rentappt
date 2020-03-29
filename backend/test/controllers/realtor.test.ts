import faker from 'faker';
import supertest from 'supertest';
import { OK, UNAUTHORIZED, FORBIDDEN, UNPROCESSABLE_ENTITY } from 'http-status';

import App from '../../src/config/App';
import { Apartment, User } from '../../src/models';
import { generateToken } from '../../src/utils/jwt';
import { Roles } from '../../src/constants/Roles';

jest.mock('../../src/models');

describe('RealtorController', () => {
  let token: string;
  let id: number;
  beforeAll(async () => {
    id = faker.random.number(100);
    token = await generateToken(id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listApartments', () => {
    it('should throw an error about authorization', done => {
      supertest(new App().app)
        .get('/realtor/apartments')
        .expect(UNAUTHORIZED)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('You must be logged in');
          done();
        });
    });

    it('should throw an error about forbidden', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Client }) });

      supertest(new App().app)
        .get('/realtor/apartments')
        .set('Authorization', `Bearer ${token}`)
        .expect(FORBIDDEN)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('You are not allowed to perform this');
          done();
        });
    });

    it('should list some apartments successfully', done => {
      const offset = faker.random.number(5);
      const limit = faker.random.number(10);

      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      //@ts-ignore
      Apartment.findAndCountAll.mockReturnValueOnce({
        rows: new Array(limit).fill({
          get() {
            return {};
          },
        }),
        count: limit * 10,
      });

      supertest(new App().app)
        .get('/realtor/apartments')
        .set('Authorization', `Bearer ${token}`)
        .query({ offset, limit })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toHaveProperty('list');
          expect(res.body).toHaveProperty('total', limit * 10);
          expect(res.body.list).toHaveLength(limit);
          done();
        });
    });
  });

  describe('createApartment', () => {
    it('should create an apartment successfully', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const data = {
        name: faker.name.findName(),
        description: faker.random.words(5),
        floorAreaSize: faker.random.number(100000),
        rentPrice: faker.random.number(10000),
        rooms: faker.random.number(20),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      };

      //@ts-ignore
      Apartment.create.mockReturnValueOnce({
        get() {
          return { ...data, id: faker.random.number(100), realtorId: id };
        },
      });

      supertest(new App().app)
        .post('/realtor/apartment')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject(data);
          expect(res.body.realtorId).toBe(id);
          done();
        });
    });
  });

  describe('updateApartment', () => {
    it('should update an apartment successfully', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const apartmentId = faker.random.number(1000);
      const currentApartment = {
        id: apartmentId,
        name: faker.name.findName(),
        description: faker.random.words(5),
        floorAreaSize: faker.random.number(100000),
        rentPrice: faker.random.number(10000),
        rooms: faker.random.number(20),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
      };

      const updateData = {
        name: faker.hacker.phrase(),
      };

      //@ts-ignore
      Apartment.update.mockReturnValueOnce([faker.random.word()]);
      //@ts-ignore
      Apartment.findByPk.mockImplementationOnce(
        (comingId: number) =>
          new Promise((resolve, reject) => {
            if (comingId === apartmentId) {
              resolve({
                get() {
                  return { ...currentApartment, ...updateData };
                },
              });
            } else {
              reject(new Error('Wrong ID!'));
            }
          })
      );

      supertest(new App().app)
        .put('/realtor/apartment')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...updateData, id: apartmentId })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(Apartment.update).toHaveBeenCalledWith(updateData, { where: { id: apartmentId } });
          expect(res.body).toMatchObject({ ...currentApartment, ...updateData });
          done();
        });
    });

    it('should fail to update an apartment', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const apartmentId = faker.random.number(1000);
      const updateData = {
        id: apartmentId,
      };

      //@ts-ignore
      Apartment.update.mockReturnValueOnce(null);

      supertest(new App().app)
        .put('/realtor/apartment')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(UNPROCESSABLE_ENTITY)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Unable to find an "apartment" with the given ID');
          done();
        });
    });
  });

  describe('deleteApartment', () => {
    it('should delete an apartment successfully', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const apartmentId = faker.random.number(1000);
      //@ts-ignore
      Apartment.destroy.mockReturnValueOnce(1);

      supertest(new App().app)
        .delete('/realtor/apartment')
        .set('Authorization', `Bearer ${token}`)
        .send({ id: apartmentId })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject({});
          expect(Apartment.destroy).toBeCalledWith({ where: { id: apartmentId } });
          done();
        });
    });

    it('should fail to delete an apartment', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const apartmentId = faker.random.number(1000);
      //@ts-ignore
      Apartment.destroy.mockReturnValueOnce(0);

      supertest(new App().app)
        .delete('/realtor/apartment')
        .set('Authorization', `Bearer ${token}`)
        .send({ id: apartmentId })
        .expect(UNPROCESSABLE_ENTITY)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Unable to find an "apartment" with the given ID');
          expect(Apartment.destroy).toBeCalledWith({ where: { id: apartmentId } });
          done();
        });
    });
  });

  describe('setApartmentAsRent', () => {
    it('should set an apartment as rent successfully', done => {
      //@ts-ignore
      User.findByPk.mockReturnValueOnce({ get: () => ({ role: Roles.Realtor }) });

      const apartmentId = faker.random.number(1000);
      const currentApartment = {
        id: apartmentId,
        name: faker.name.findName(),
        description: faker.random.words(5),
        floorAreaSize: faker.random.number(100000),
        rentPrice: faker.random.number(10000),
        rooms: faker.random.number(20),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude(),
        available: true,
      };

      //@ts-ignore
      Apartment.update.mockReturnValueOnce([faker.random.word()]);

      //@ts-ignore
      Apartment.findByPk.mockImplementationOnce(
        (comingId: number) =>
          new Promise((resolve, reject) => {
            if (comingId === apartmentId) {
              resolve({
                get() {
                  return { ...currentApartment, available: true };
                },
              });
            } else {
              reject(new Error('Wrong ID!'));
            }
          })
      );

      supertest(new App().app)
        .patch('/realtor/rent')
        .set('Authorization', `Bearer ${token}`)
        .send({ available: true, id: apartmentId })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(Apartment.update).toHaveBeenCalledWith({ available: true }, { where: { id: apartmentId } });
          expect(res.body).toMatchObject({ ...currentApartment, available: true });
          done();
        });
    });
  });
});
