import { ErrorRequestHandler } from 'express';
import { ValidationError } from '@hapi/joi';
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, CONFLICT } from 'http-status';

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    res.status(CONFLICT).send(error.original.message);
  } else if ((error as ValidationError).details) {
    res.status(UNPROCESSABLE_ENTITY).send(error.message);
  } else {
    res.status(error.status || INTERNAL_SERVER_ERROR).send(error.message);
  }
};

export default errorHandler;
