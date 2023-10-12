import sequelize, {initDb} from "./db/sequelize";

async function synchronize() {
  await initDb();
  await sequelize.sync({force: true});
  console.log("All tables successfully synchronized!");
}

synchronize().then(() => {
  console.log("done.");
}).catch(err => {
  console.log("error occurred. ", err)
});