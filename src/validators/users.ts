import {check} from 'express-validator';

const validateUserObj = [
  check('name').exists().trim(),
  check('email').exists().isEmail().toLowerCase()
]

const validateUserStatuses = [
  check('user_statuses').exists().isArray()
]

const validateUserGroup = [
  check('group_id').exists()
]

export {validateUserObj, validateUserStatuses, validateUserGroup}