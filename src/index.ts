import devParams from "./config/config";
import express from 'express';
import usersRouter from './routes/users';
import {initDb} from "./db/sequelize";
import synchronize from "./migrations";
import seedData from "./seeders";
import groupsRouter from "./routes/groups";

const apiPrefix = "/api";
const app = express();

const PORT = devParams.port;


async function onStart() {
  await initDb();
  await synchronize();
  await seedData();
  console.log(`Server running on port ${PORT}`);
}

/**
 * Middlewares
 */
app.use(express.json());

/**
 * Routes.
 */
app.use(apiPrefix, usersRouter);
app.use(apiPrefix, groupsRouter);


app.listen(PORT, onStart);