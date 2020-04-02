# Apartment Rental Projec

## One command to rule them all!

The whole app can be run with a single command (requires docker and docker-compose installed on your local machine):

```sh
docker-compose up --build
```

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

## APP

### Prerequisites

- **Node.js** v12.16
- **Yarn** v1.22

### Installing dependencies

```sh
cd frontend && yarn install
```

### Running

Development mode:

```sh
cd backend && yarn start
```

Production mode:

```sh
cd backend && yarn build && <serve the static files>
```

### Environmental variables

| Name                             | Required |   Default   |
| -------------------------------- | :------: | :---------: |
| NODE_ENV                         |  false   | development |
| REACT_APP_API_ENDPOINT           |   true   |      -      |
| REACT_APP_GOOGLE_MAPS_API_KEY    |   true   |      -      |
| REACT_APP_GOOGLE_GEOCODE_API_KEY |   true   |      -      |
