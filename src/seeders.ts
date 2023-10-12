import {initDb} from "./db/sequelize";
import Group from "./models/group";

async function seedData() {
  await initDb();
  await createGroup();
  console.log("Data successfully seeded!");
}

async function createGroup() {
  const group = Group.build({name: "First Group"});
  await group.save();
}

seedData().then(() => {
  console.log("done.");
}).catch(err => {
  console.log("error occurred. ", err)
});