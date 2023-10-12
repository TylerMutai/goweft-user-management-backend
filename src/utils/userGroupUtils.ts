import GroupModel from "../models/group";
import UserModel from "../models/user";

async function isUserAndGroupValid(userId: string, groupId: string) {
  // lock row since we might be updating it in other requests.
  const group = await GroupModel.findByPk(groupId, {
    lock: true
  });
  const user = await UserModel.findByPk(userId);

  return [group && user, group];
}

export {isUserAndGroupValid}