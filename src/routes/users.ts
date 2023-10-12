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
  .post(create)

  // We're using post here to allow for filtering with alot of data since 'GET' url has a maximum size limit.
  .post(validateUserObj, getAll);

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