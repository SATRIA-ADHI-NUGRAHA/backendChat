const db = require('../config/db')

module.exports = {
  insert: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO friends SET ?`, data, (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  getFriend: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from friends LEFT JOIN users ON friends.friend_id=users.id WHERE user_id = ?`, id, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  deleteFriend: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM friends WHERE user_id = ?`, id, (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  updateNotif: (data, id, idfriend) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE friends SET ? WHERE user_id = ? AND friend_id = ?`, [data, id, idfriend], (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  getNotif: (id, idfriend) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`, [id, idfriend], (err, res) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  }
}