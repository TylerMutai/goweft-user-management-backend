import {Dialect, Sequelize} from "sequelize";
import devParams from "../config/config";


const sequelize = new Sequelize(devParams.database, devParams.database_username, devParams.database_password, {
  host: devParams.database_host,
  dialect: devParams.database_dialect as Dialect
});

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;
export {initDb}