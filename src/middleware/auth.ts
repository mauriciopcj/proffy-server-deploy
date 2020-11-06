import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import db from '../database/connnection';

const auth = async (request: Request, response: Response, next: NextFunction) => {
  const { authorization }  = request.headers;

  if (!authorization) {
    return response.status(401).send({ error: "No token provided" });
  }

  const [scheme, token] = authorization.split(" ");

  try {
    jwt.verify(token, "secret", (err, payload) => {
      if (err) {
        return response.status(401).json({
          error: 'Invalid token'
        })
      }

      const { id } = payload;

      db('users').where('id', '=', id).then(users => {

        request.user = users[0];
        return next();
        
      }).catch(err => {

        return response.status(404).json({
          error: 'Unexpected error while find User'
        })
      });
    });
  } catch (err) {
    return response.status(404).json({ error: "Error in servidor" });
  }
}

export default auth;