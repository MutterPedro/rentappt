import faker from 'faker';
import supertest from 'supertest';
import { OK, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY, FORBIDDEN, UNAUTHORIZED } from 'http-status';

import App from '../../src/config/App';
import { User, Apartment } from '../../src/models';

jest.mock('../../src/models');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create an user successfully', done => {
      const user = {
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
        birth: faker.date.past(50).toString(),
        phone: faker.phone.phoneNumber('#############'),
      };
      //@ts-ignore
      User.create.mockReturnValueOnce(
        new Promise(resolve => {
          resolve({
            get() {
              return user;
            },
          });
        })
      );

      supertest(new App().app)
        .post('/user')
        .send(user)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject(user);
          done();
        });
    });

    it('should fail to create an user', done => {
      const user = {
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
        birth: faker.date.past(50).toString(),
        phone: faker.phone.phoneNumber('#############'),
      };
      const message = faker.hacker.phrase();

      //@ts-ignore
      User.create.mockImplementationOnce(() => {
        throw new Error(message);
      });

      supertest(new App().app)
        .post('/user')
        .send(user)
        .expect(INTERNAL_SERVER_ERROR)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe(message);
          done();
        });
    });
  });

  describe('updateUser', () => {
    it('should update an user successfully', done => {
      const id = faker.random.number(1000);
      const currentUser = {
        id,
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        birth: faker.date.past(50).toString(),
        phone: faker.phone.phoneNumber('#############'),
      };

      const updateData = {
        id,
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
      };

      //@ts-ignore
      User.update.mockReturnValueOnce([faker.random.word()]);
      //@ts-ignore
      User.findByPk.mockImplementationOnce(
        (comingId: number) =>
          new Promise((resolve, reject) => {
            if (comingId === id) {
              resolve({
                get() {
                  return { ...currentUser, ...updateData };
                },
              });
            } else {
              reject(new Error('Wrong ID!'));
            }
          })
      );

      supertest(new App().app)
        .put('/user')
        .send(updateData)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(User.update).toHaveBeenCalledWith(updateData, { where: { id } });
          expect(res.body).toMatchObject({ ...currentUser, ...updateData });
          done();
        });
    });

    it('should fail to update an user', done => {
      const id = faker.random.number(1000);
      const updateData = {
        id,
      };

      //@ts-ignore
      User.update.mockReturnValueOnce(null);

      supertest(new App().app)
        .put('/user')
        .send(updateData)
        .expect(UNPROCESSABLE_ENTITY)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Unable to find an "user" with the given ID');
          done();
        });
    });
  });

  describe('deleteUser', () => {
    it('should delete an user successfully', done => {
      const id = faker.random.number(1000);
      //@ts-ignore
      User.destroy.mockReturnValueOnce(1);

      supertest(new App().app)
        .delete('/user')
        .send({ id })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject({});
          expect(User.destroy).toBeCalledWith({ where: { id } });
          done();
        });
    });

    it('should fail to delete an user', done => {
      const id = faker.random.number(1000);
      //@ts-ignore
      User.destroy.mockReturnValueOnce(0);

      supertest(new App().app)
        .delete('/user')
        .send({ id })
        .expect(UNPROCESSABLE_ENTITY)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Unable to find an "user" with the given ID');
          expect(User.destroy).toBeCalledWith({ where: { id } });
          done();
        });
    });
  });

  describe('updatePassword', () => {
    it('should update an user password successfully', done => {
      const data = {
        oldPassword: faker.hacker.adjective() + faker.hacker.noun(),
        newPassword: faker.hacker.adjective() + faker.hacker.noun(),
        id: faker.random.number(2000),
      };

      //@ts-ignore
      User.findByPk.mockImplementationOnce(id => {
        if (id === data.id) {
          return {
            get() {
              return { password: data.oldPassword };
            },
          };
        }

        throw new Error('Wrong ID');
      });

      supertest(new App().app)
        .patch('/user/password')
        .send(data)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject({});
          expect(User.findByPk).toHaveBeenCalledWith(data.id);
          expect(User.update).toHaveBeenCalledWith({ password: data.newPassword }, { where: { id: data.id } });
          done();
        });
    });

    it('should fail to update an user password with wrong current password', done => {
      const data = {
        oldPassword: faker.hacker.adjective() + faker.hacker.noun(),
        newPassword: faker.hacker.adjective() + faker.hacker.noun(),
        id: faker.random.number(2000),
      };

      //@ts-ignore
      User.findByPk.mockImplementationOnce(id => {
        if (id === data.id) {
          return {
            get() {
              return { password: faker.hacker.adjective() + faker.hacker.noun() };
            },
          };
        }

        throw new Error('Wrong ID');
      });

      supertest(new App().app)
        .patch('/user/password')
        .send(data)
        .expect(FORBIDDEN)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Current password provided is not correct');
          done();
        });
    });

    it('should fail to update an user password with wrong id', done => {
      const data = {
        oldPassword: faker.hacker.adjective() + faker.hacker.noun(),
        newPassword: faker.hacker.adjective() + faker.hacker.noun(),
        id: faker.random.number(2000),
      };

      //@ts-ignore
      User.findByPk.mockImplementationOnce(id => {
        if (id === data.id) {
          return null;
        }

        throw new Error('Wrong ID');
      });

      supertest(new App().app)
        .patch('/user/password')
        .send(data)
        .expect(UNPROCESSABLE_ENTITY)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('Unable to find an "user" with the given ID');
          done();
        });
    });
  });

  describe('login', () => {
    it('should login an user successfully', done => {
      const user = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
      };
      //@ts-ignore
      User.findOne.mockReturnValueOnce({
        get() {
          return { id: faker.random.number(1000) };
        },
      });

      supertest(new App().app)
        .post('/user/login')
        .send(user)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(User.findOne).toHaveBeenCalledWith({
            where: user,
            attributes: { exclude: ['password'] },
          });
          done();
        });
    });

    it('should fail to login an user with wrong credentials', done => {
      const user = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
      };
      //@ts-ignore
      User.findOne.mockReturnValueOnce(null);

      supertest(new App().app)
        .post('/user/login')
        .send(user)
        .expect(UNAUTHORIZED)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).toBe('E-mail or password incorrect');
          expect(User.findOne).toHaveBeenCalledWith({
            where: user,
            attributes: { exclude: ['password'] },
          });
          done();
        });
    });
  });

  describe('listApartments', () => {
    it('should list some apartments successfully', done => {
      const offset = faker.random.number(5);
      const limit = faker.random.number(10);

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
        .get('/user/apartments')
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
});
