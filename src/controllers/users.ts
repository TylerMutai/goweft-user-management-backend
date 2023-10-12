import {RequestHandler} from "express";
import devParams from "../config/config";
import UserModel from "../models/user";
import {Op} from "sequelize";
import {validationResult} from "express-validator";
import {allStatuses} from "../types/statuses";
import sequelize from "../db/sequelize";
import Group from "../models/group";
import UserGroup from "../models/userGroup";
import {isUserAndGroupValid} from "../utils/userGroupUtils";
import {jsonMessageResponse} from "../utils/jsonMessages";

const getAll: RequestHandler = async function (req, res, next) {
  try {
    const name = req.query.name;
    const email = req.query.email;
    let emails: Array<string> = [];
    if (email) {
      emails = `${email}`?.split(' ');
      if (email.length === 0) {
        return res.status(400).json(jsonMessageResponse('[email] key must be seperated with "+"'))
      }
    }

    let whereOptions: { [key: string]: any } = {}
    if (name) {
      whereOptions = {
        ...whereOptions,
        name: {
          [Op.like]: `%${`${name}`.toLowerCase()}%`
        }
      }
    }

    if (emails.length > 0) {
      whereOptions = {
        ...whereOptions,
        email: {
          [Op.in]: emails
        }
      }
    }

    let limit = parseInt(`${req.body.limit || devParams.defaultPaginationLimit}`);   // number of records per page
    let page = parseInt(`${req.body.page || 1}`);
    const result = await UserModel.findAndCountAll({
      where: whereOptions
    });

    let pages = Math.ceil(result.count / limit);
    const offset = limit * (page - 1)
    const users = await UserModel.findAll({
      where: whereOptions,
      order: [
        ['id', 'ASC'],
      ],
      limit: limit,
      offset: offset,
    })

    res.status(200).json({'result': users, 'count': result.count, 'pages': pages});
  } catch (e) {
    next(e);
  }
}

const getOne: RequestHandler = async function (req, res, next) {
  const id = req.params.userId;
  try {
    const user = await UserModel.findByPk(id);
    if (user) {
      res.json(user)
    } else {
      res.status(404).json(jsonMessageResponse("user not found"));
    }
  } catch (e) {
    next(e);
  }
}

const create: RequestHandler = async function (req, res, next) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const user = await UserModel.create(req.body)
      await user.save();
      return res.status(201).json(user);
    } else {
      res.status(400).json(jsonMessageResponse("Validation Failed", result.array()));
    }
  } catch (e) {
    next(e);
  }
}

const update: RequestHandler = async function (req, res, next) {
  try {
    const id = req.params.userId;
    const user = await UserModel.findByPk(id);
    if (user) {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const user = await UserModel.update(req.body, {
          where: {
            id: {
              [Op.is]: id
            }
          }
        })
        return res.status(201).json(user);
      } else {
        res.status(400).json(jsonMessageResponse("Validation Failed", result.array()));
      }
    } else {
      res.status(404).json(jsonMessageResponse("user not found"));
    }
  } catch (e) {
    next(e);
  }
}

const updateUserStatuses: RequestHandler = async function (req, res, next) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      // create a map of all statuses according to the request.
      const userStatuses = new Map<string, Array<number | string>>();
      const users = req.body.user_statuses || [];
      console.log("users", users);
      console.log("allStatuses", allStatuses);
      for (const u of users) {
        if (allStatuses.includes(u.status)) {
          const current = userStatuses.get(u.status) || [];
          if (u.user_id) {
            current.push(u.user_id)
          }
          userStatuses.set(u.status, current);
        }
      }
      console.log("userStatuses", userStatuses);

      // now run update queries for all keys in [userStatuses].
      const keys = Array.from(userStatuses.keys());

      // create a managed transaction that will automatically roll back in-case this bulk operation fails.
      await sequelize.transaction(async (t) => {
        for (const k of keys) {
          await UserModel.update({
            status: k
          }, {
            transaction: t,
            where: {
              id: {
                [Op.in]: userStatuses.get(k)
              }
            }
          })
        }
      })

      return res.json(jsonMessageResponse("User statuses updated successfully!"));
    }
    res.status(400).json(jsonMessageResponse("Validation Failed", result.array()));
  } catch (e) {
    next(e);
  }
}

const updateUserGroup: RequestHandler = async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const groupId = req.body.group_id;
    const [isValid, group] = await isUserAndGroupValid(userId, groupId)
    if (!(isValid)) {
      return res.status(404).json(jsonMessageResponse("Either group or user passed does not exist."))
    }

    // create a managed transaction that will automatically roll back in-case one operation fails.
    await sequelize.transaction(async (t) => {
      let userGroup = UserGroup.findOne({
        where: {
          user_id: userId
        }
      });
      if (!userGroup) {
        res.status(400).json(jsonMessageResponse("You need to assign group to user first."))
      } else {
        await UserGroup.update({
          group_id: groupId
        }, {
          where: {
            user_id: userId
          },
          transaction: t
        })
      }

      // if the group status is 'notEmpty', update it.
      let groupJson = group.toJSON();
      if (groupJson.status === 'empty') {
        await Group.update({
          status: 'notEmpty'
        }, {
          where: {
            id: groupId
          },
          transaction: t
        })
      }
    })
    // successful operation.
    res.json(jsonMessageResponse("User group updated successfully."))
  } catch (e) {
    next(e);
  }
}

const addUserToGroup: RequestHandler = async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const groupId = req.body.group_id;
    const [isValid, group] = await isUserAndGroupValid(userId, groupId)
    if (!(isValid)) {
      return res.status(404).json(jsonMessageResponse("Either group or user passed does not exist."))
    }

    // create a managed transaction that will automatically roll back in-case one operation fails.
    await sequelize.transaction(async (t) => {

      let _userGroup = await UserGroup.findOne({
        where: {
          user_id: userId
        }
      });
      if (_userGroup) {
        return res.status(400).json(jsonMessageResponse("User already belongs to a group."))
      }
      const userGroup = await UserGroup.create({
        group_id: groupId,
        user_id: userId
      }, {
        transaction: t
      })
      await userGroup.save();

      // if the group status is 'empty', update it.
      let groupJson = group.toJSON();
      if (groupJson.status === 'empty') {
        await Group.update({
          status: 'notEmpty'
        }, {
          where: {
            id: groupId
          },
          transaction: t
        })
      }
    })
    // successful operation.
    res.json(jsonMessageResponse("User group added successfully."))
  } catch (e) {
    next(e);
  }
}

const removeUserFromGroup: RequestHandler = async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const groupId = req.body.group_id;
    const [isValid, group] = await isUserAndGroupValid(userId, groupId)
    if (!(isValid)) {
      return res.status(404).json(jsonMessageResponse("Either group or user passed does not exist."))
    }

    // create a managed transaction that will automatically roll back in-case one operation fails.
    await sequelize.transaction(async (t) => {
      let userGroup = UserGroup.findOne({
        where: {
          user_id: userId
        }
      });
      if (userGroup) {
        await UserGroup.destroy({
          where: {
            user_id: userId
          },
          transaction: t
        })
      }

      // get userGroups for this Group.
      const _userGroups = await UserGroup.findAndCountAll({
        where: {
          group_id: groupId
        }
      })

      // if there aren't any records, set group to empty.
      if (_userGroups.count === 0) {
        // if the group status is 'notEmpty', update it.
        let groupJson = group.toJSON();
        if (groupJson.status === 'notEmpty') {
          await Group.update({
            status: 'empty'
          }, {
            where: {
              id: groupId
            },
            transaction: t
          })
        }
      }
    })
    // successful operation.
    res.json(jsonMessageResponse("User group updated successfully."))
  } catch (e) {
    next(e);
  }
}

export {update, create, addUserToGroup, getOne, getAll, removeUserFromGroup, updateUserGroup, updateUserStatuses}