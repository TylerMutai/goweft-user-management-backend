import devParams from "./config/config";
import express from 'express';
import usersRouter from './routes/users';
import {initDb} from "./db/sequelize";

const apiPrefix = "/api";
const app = express();

const PORT = devParams.port;


async function onStart() {
  console.log(`Server running on port ${PORT}`);
  await initDb();
}

/**
 * Middlewares
 */
app.use(express.json());

/**
 * Routes.
 */
app.use(apiPrefix, usersRouter);


app.listen(PORT, onStart);