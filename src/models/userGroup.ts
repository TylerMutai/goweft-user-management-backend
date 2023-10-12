import {DataTypes, Model} from "sequelize";
import sequelize from "../db/sequelize";
import UserModel from "./user";
import Group from "./group";

// We've opted to use this structure in case for future purposes,
// a user might belong to more than one group.
class UserGroupModel extends Model {

}

UserGroupModel.init({
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: UserModel,
      key: 'id',
    },
    primaryKey: true
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id',
    },
    primaryKey: true
  },
}, {
  sequelize,
  modelName: 'UserGroup'
});

export default UserGroupModel;