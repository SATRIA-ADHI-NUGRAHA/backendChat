const express = require('express')
const usersController = require('../controllers/usersControllers')
const router = express.Router()

router 
  .get('/getAll', usersController.getAllUsers)
  .get('/getdetail/:id', usersController.getDetail) 
  .post('/login', usersController.login)
  .post('/register', usersController.registerController)
  .get('/verify/:token', usersController.verify)
  // .post('/logout/:iduser', usersController.Logout)
  // .post('/refreshToken', usersController.renewToken)
  // .post('/forgotpassword', usersController.forgotpassword)
  // .post('/newPassword/:userkey', usersController.newPassword)
  .patch('/updatedata/:id', usersController.updateUser)
  .patch('/updateimage/:id', usersController.updateImage)
  .delete('/deletemsg/:id', usersController.deleteMsg)

  module.exports = router