import {DataTypes, Model} from "sequelize";
import sequelize from "../db/sequelize";

class UserModel extends Model {

}

UserModel.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
}, {
  sequelize,
  modelName: 'User'
});

export default UserModel;