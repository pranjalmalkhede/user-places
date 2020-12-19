const express = require('express');
const UserController = require('../controllers/users-controller')
const checkAuth = require('../middleware/check-auth')
const {check} = require('express-validator')

const router =express.Router()

router.get('/',UserController.getUsers)

router.use(checkAuth)
router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("password").isLength(5),
  ],
  UserController.createUser
);
// router.delete('/:uid',UserController.deleteUser)

router.patch('/:uid',check('name').notEmpty(),UserController.updateUser)
router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").isLength(5),
  ],
  UserController.loginUser
);

module.exports =router