import {RequestHandler} from "express";
import GroupModel from "../models/group";
import UserGroup from "../models/userGroup";
import {Op} from "sequelize";

const getAll: RequestHandler = async function (req, res, next) {
  try {
    const userId = req.query.user_id;
    let options = {};
    if (userId) {
      const userGroups = await UserGroup.findAll({
        where: {
          user_id: userId
        }
      })
      const ids = userGroups.map(u => {
        return u.toJSON().user_id;
      })
      options = {
        id: {
          [Op.in]: ids
        }
      }
    }
    const groups = await GroupModel.findAll({where: options}).catch(next);
    res.json({result: groups});
  } catch (e) {
    next(e);
  }
}

export {getAll}