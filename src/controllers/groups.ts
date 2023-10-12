import {RequestHandler} from "express";
import GroupModel from "../models/group";

const getAll: RequestHandler = async function (req, res, next) {
  try {
    const groups = await GroupModel.findAll().catch(next);
    res.json({result: groups});
  } catch (e) {
    next(e);
  }
}

export {getAll}