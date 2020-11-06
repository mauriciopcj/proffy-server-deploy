import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors()); // para aceitar requisições de outros endereços
app.use(express.json()); // express não entende json
app.use(routes);

app.listen(process.env.PORT || 3333);