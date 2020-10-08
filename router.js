const express = require('express')
const usersController = require('./controllers/usersControllers')
const router = express.Router()

router 
  .get('/getAll', usersController.getAllUsers)
  .get('/getDetail/:id', usersController.getDetailController) 
  .post('/login', usersController.loginController)
  .post('/register', usersController.registerController)
  .get('/verify/:token', usersController.verify)
  // .post('/refreshToken', usersController.renewToken)
  // .post('/forgotpassword', usersController.forgotpassword)
  // .post('/newPassword/:userkey', usersController.newPassword)

  module.exports = router