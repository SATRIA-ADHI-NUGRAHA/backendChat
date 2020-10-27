const { insert, updateNotif, deleteFriend, getFriend } = require('../models/friendModels')
const { failed, success } = require('../helpers/response')

module.exports = {
  insert: (req, res) => {
    const body = req.body
    const data = {
      user_id: body.user_id,
      friend_id: body.friend_id
    }
    insert(data)
      .then(result => {
        success(res, result, 'Success add friend')
      }).catch(err => {
        failed(res, [], err.message)
      })
    insert({
      user_id: body.friend_id,
      friend_id: body.user_id
    })
  },
  getFriends: (req, res) => {
    const id = req.params.id
    getFriend(id)
      .then(result => {
        success(res, result, 'Get users friends')
      }).catch(err => {
        failed(res, [], err.message)
      })
  },
  delete: (req, res) => {
    const id = req.params.id
    deleteFriend(id)
      .then(result => {
        success(res, result, 'Delete friend success')
      }).catch(err => {
        failed(res, [], err.message)
      })
  },
  updateNewNotif: (req, res) => {
    const body = req.body
    const iduser = body.user_id
    const idfriend = body.friend_id
    const data = {
      msg_notif: 0 
    }
    updateNotif(data, iduser, idfriend)
      .then(response => {
        success(res, response, 'set new message done !')
      }).catch(err => {
        failed(res, [], err.message)
      })
  }
}