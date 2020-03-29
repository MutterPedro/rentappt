import { RequestHandler } from 'express';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status';

import { Roles } from '../constants/Roles';
import ResponseError from '../utils/ResponseError';
import { parseToken } from '../utils/jwt';
import { getUserById } from '../business/user';

export const SESSION = Symbol('user_session');

export default function authorization(role: Roles): RequestHandler {
  return async (req, _res, next) => {
    try {
      const token = (req.header('Authorization') || '')
        .split('Bearer')
        .filter(Boolean)
        .map(s => s.trim())[0];

      if (token) {
        const userId = await parseToken(token);
        const user = await getUserById(userId, ['password']);

        if (user && user.role >= role) {
          //@ts-ignore
          req.body[SESSION] = userId;
          next();
        } else {
          next(new ResponseError(FORBIDDEN, 'You are not allowed to perform this'));
        }
      } else {
        next(new ResponseError(UNAUTHORIZED, 'You must be logged in'));
      }
    } catch (e) {
      next(e);
    }
  };
}
