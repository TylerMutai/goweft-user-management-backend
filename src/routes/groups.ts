import {Router} from "express";
import {getAll} from "../controllers/groups";

const router = Router();

router.route('/groups')
  .get(getAll);

export default router;