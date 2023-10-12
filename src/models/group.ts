import {DataTypes, Model} from "sequelize";
import sequelize from "../db/sequelize";

class GroupModel extends Model {
}

GroupModel.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'empty'
  },
}, {
  sequelize,
  modelName: 'Group'
});

export default GroupModel;