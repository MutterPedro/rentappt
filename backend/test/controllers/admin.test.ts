import faker from 'faker';
import supertest from 'supertest';
import { OK } from 'http-status';

import App from '../../src/config/App';
import { User } from '../../src/models';
import { generateToken } from '../../src/utils/jwt';
import { Roles } from '../../src/constants/Roles';
import { RequestHandler } from 'express';

jest.mock('../../src/models');
jest.mock('../../src/middlewares/authorization.ts', () => (): RequestHandler => {
  return (_req, _res, next) => next();
});

describe('AdminController', () => {
  let token: string;
  let id: number;
  beforeAll(async () => {
    id = faker.random.number(100);
    token = await generateToken(id);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.unmock('../../src/middlewares/authorization');
  });

  describe('adminCreateUser', () => {
    it('should admin create an user successfully', done => {
      const userId = faker.random.number(100);

      const user = {
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
        birth: faker.date.past(50).toString(),
        phone: faker.phone.phoneNumber('#############'),
        role: Roles.Admin,
      };

      //@ts-ignore
      User.create.mockReturnValueOnce({
        get() {
          return { ...user, id: userId };
        },
      });

      supertest(new App().app)
        .post('/admin/user')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect({ ...user, id: userId }).toMatchObject(res.body);
          expect(res.body).not.toHaveProperty('password');
          expect(res.body).toHaveProperty('id', userId);
          done();
        });
    });
  });

  describe('adminUpdateUser', () => {
    it('should admin update an user successfully', done => {
      const userId = faker.random.number(100);
      const currentUser = {
        id: userId,
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10),
        birth: faker.date.past(50).toString(),
        phone: faker.phone.phoneNumber('#############'),
        role: Roles.Admin,
      };

      const data = {
        id: userId,
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
      };

      //@ts-ignore
      User.update.mockReturnValueOnce([faker.random.word()]);
      //@ts-ignore
      User.findByPk.mockImplementationOnce(
        (comingId: number) =>
          new Promise((resolve, reject) => {
            if (comingId === userId) {
              resolve({
                get() {
                  delete currentUser.password;
                  return { ...currentUser, ...data };
                },
              });
            } else {
              reject(new Error('Wrong ID!'));
            }
          })
      );

      supertest(new App().app)
        .put('/admin/user')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect({ ...currentUser, ...data }).toMatchObject(res.body);
          expect(res.body).not.toHaveProperty('password');
          expect(res.body).toHaveProperty('id', userId);

          done();
        });
    });
  });

  describe('adminDeleteUser', () => {
    it('should admin delete an user successfully', done => {
      const userId = faker.random.number(100);

      //@ts-ignore
      User.destroy.mockReturnValueOnce(1);

      supertest(new App().app)
        .delete('/admin/user')
        .set('Authorization', `Bearer ${token}`)
        .send({ id: userId })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toMatchObject({});
          expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
          done();
        });
    });
  });

  describe('adminListUsers', () => {
    it('should admin list some users successfully', done => {
      const offset = faker.random.number();
      const limit = faker.random.number(100);

      //@ts-ignore
      User.findAndCountAll.mockReturnValueOnce({
        rows: new Array(limit).fill({
          get() {
            return {};
          },
        }),
        count: limit,
      });

      supertest(new App().app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${token}`)
        .query({ offset, limit })
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.body).toHaveProperty('total', limit);
          expect(res.body).toHaveProperty('list');
          expect(res.body.list).toHaveLength(limit);
          expect(User.findAndCountAll).toHaveBeenCalledWith({
            offset: offset.toString(),
            limit: limit.toString(),
            where: {},
            attributes: { exclude: ['password'] },
          });
          done();
        });
    });
  });
});
