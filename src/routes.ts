import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UsersController from './controllers/UsersController';

import auth from './middleware/auth';

const routes = express.Router();
const classesControllers = new ClassesController();
const connectionsController = new ConnectionsController();
const usersController = new UsersController();

routes.post('/classes', classesControllers.create);
routes.get('/classes', classesControllers.index);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.post('/users/login', usersController.login);
routes.post('/users', usersController.create);
routes.get('/users', auth, usersController.index);

export default routes;