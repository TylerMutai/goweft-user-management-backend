import Group from "./models/group";

async function seedData() {
  await createGroup();
  console.log("Data successfully seeded!");
}

async function createGroup() {
  const group = Group.build({name: "First Group"});
  await group.save();
}

export default seedData;