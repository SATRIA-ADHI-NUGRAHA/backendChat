const express = require('express')
const route = express.Router()
const friendsControllera = require('../controllers/friendControllers')

route
  .post('/insert', friendsControllera.insert)
  .get('/find/:id', friendsControllera.getFriends)
  .delete('/delete/:id', friendsControllera.delete)
  .patch('/updatenotif', friendsControllera.updateNewNotif)

module.exports = route