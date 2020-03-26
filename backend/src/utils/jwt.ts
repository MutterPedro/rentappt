import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { JWT_SALT } from './environment';

export function generateToken(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({ uid: id }, JWT_SALT, { algorithm: 'HS256', expiresIn: '30d' }, (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(token);
    });
  });
}

export function parseToken(token: string): Promise<number> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SALT, {}, (err, decoded: { uid?: number }) => {
      if (err) {
        reject(err);
        return;
      }

      if (decoded.uid) {
        resolve(decoded.uid);
        return;
      }

      reject(new JsonWebTokenError('Malformed token'));
    });
  });
}
