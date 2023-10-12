import sequelize from "./db/sequelize";

async function synchronize() {
  await sequelize.sync({alter: true});
  console.log("All tables successfully synchronized!");
}

export default synchronize;