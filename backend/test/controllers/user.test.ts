import faker from 'faker';
import supertest from 'supertest';
import { OK, INTERNAL_SERVER_ERROR, UNPROCESSABLE_ENTITY } from 'http-status';

import App from '../../src/config/App';
import { User } from '../../src/models';

jest.mock('../../src/models');

describe('UserController', () => {
  describe('createUser', () => {
    it('should create an user successfully', done => {
      const user = {
        name: faker.hacker.phrase(),
        email: faker.internet.email(),
        password: faker.internet.password(),
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
          console.log(res.text);
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
});
