# Apartment Rental Project

## API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/bf33d8b6751d98da9d71)

### Prerequisites

- **Node.js** v12.16
- **Yarn** v1.22
- **MySQL** v5.7

### Installing dependencies

```sh
cd backend && yarn install
```

### Testing

Normal tests:

```sh
cd backend && yarn test
```

Coverage tests:

```sh
cd backend && yarn test:coverage
```

Test in watch mode (ideal for TDD):

```sh
cd backend && yarn test:watch
```

### Running

Development mode:

```sh
cd backend && yarn dev
```

Production mode:

```sh
cd backend && yarn build && NODE_ENV=production node ./dist/index.js
```

### Environmental variables

| Name        | Required |   Default   |
| ----------- | :------: | :---------: |
| NODE_ENV    |  false   | development |
| PORT        |  false   |    3000     |
| DB_HOST     |   true   |      -      |
| DB_USER     |   true   |      -      |
| DB_NAME     |   true   |      -      |
| DB_PASSWORD |   true   |      -      |
| JWT_SALT    |   true   |      -      |
