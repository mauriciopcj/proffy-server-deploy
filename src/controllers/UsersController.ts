import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../database/connnection';

export interface User {
  id: number;
  email: string;
  password: string;
}

export default class UsersController {

  async index(request: Request, response: Response) {
    const users = await db('users');

    return response.json({ users });
  }

  async create(request: Request, response: Response) {
    const { name, avatar, whatsapp, bio, email, password } = request.body;

    try {
      const hashPassword = await bcrypt.hash(password, 8);
  
      await db('users').insert({ name, avatar, whatsapp, bio, email, password: hashPassword });

      return response.status(201).send();

    } catch (err) {
      return response.status(400).json({
        error: 'Unexpected error while createing new User.'
      })
    }
  }

  async update(request: Request, response: Response) {
    const { whatsapp, bio  } = request.body;
  }

  async login(request: Request, response: Response) {
    const { email, password, remember } = request.body;

    const users = await db('users').where('email', '=', email);

    const user: User = users[0];

    if(!user) {
      return response.status(404).json({
        error: 'Users is not found.'
      })
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return response.status(401).json({
        error: 'Invalid password.'
      });
    }
    
    const token = jwt.sign({ id: user.id, email }, 'secret', { expiresIn: 80000 })

    return response.status(200).json({ token });
  }
}