import {
  addUserToGroup,
  create,
  getAll,
  getOne,
  removeUserFromGroup,
  update,
  updateUserGroup,
  updateUserStatuses
} from "../controllers/users";
import {Router} from "express";
import {validateUserGroup, validateUserObj, validateUserStatuses} from "../validators/users";

const router = Router();

router.route('/users')
  .post(validateUserObj, create)
  .get(getAll);

router.route('/users/:userId')
  .get(getOne)
  .put(validateUserObj, update)

router.route('/user-groups/:userId')
  .post(validateUserGroup, addUserToGroup)
  .patch(validateUserGroup, updateUserGroup)
  .delete(validateUserGroup, removeUserFromGroup)

router.route('/user-statuses/')
  .post(validateUserStatuses, updateUserStatuses)

export default router;