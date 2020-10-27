const { promise } = require('../config/db')
const db = require('../config/db')

module.exports = {
  insertMessage: (data) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO message SET ?', data, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  getChat: (payload) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM message WHERE (sender='${payload.sender}' AND receiver='${payload.receiver}') OR (sender='${payload.receiver}' AND receiver='${payload.sender}')`, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  }
}