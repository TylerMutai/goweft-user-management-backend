import sequelize, {initDb} from "./db/sequelize";

async function synchronize() {
  await sequelize.sync({force: true});
  console.log("All tables successfully synchronized!");
}

export default synchronize;