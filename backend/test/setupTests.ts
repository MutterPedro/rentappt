import faker from 'faker';

process.env = {
  ...process.env,
  DB_HOST: faker.random.word(),
  DB_USER: faker.random.word(),
  DB_NAME: faker.random.word(),
  DB_PASSWORD: faker.random.word(),
  JWT_SALT: faker.random.word(),
};
