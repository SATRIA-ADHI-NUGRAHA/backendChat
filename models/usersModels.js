const bodyParser = require('body-parser')
const db = require('../config/db')

const users = {
  getAll:() => {
    return new Promise((resolve,reject) => {
     db.query(`SELECT * FROM users`,
     (err, result) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(result)
      }
     })
    })
   },
   register: (data) => {
    return new Promise((resolve,reject) => {
      db.query('INSERT INTO users SET ?', data, (err,result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    }) 
  },
  login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${data.email}'`, (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        }
      )
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken='${token}' WHERE id='${id}'`,
        (err, result) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(result)
          }
        })
    })
  },
  checkRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE refreshToken = '${refreshToken}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  // Check Emall
  getEmail:(email) => {
   return new Promise((resolve,reject) => {
    db.query(`SELECT * FROM users WHERE email='${email}'`,
    (err, result) => {
      err?reject(new Error(err)): resolve(result)
    })
   })
  },
  getId:(id) => {
    return new Promise((resolve,reject) => {
     db.query(`SELECT * FROM users WHERE id='${id}'`,
     (err, result) => {
      if (err) {
        reject(new Error(err))
      }else{
        resolve(result)
      }
     })
    })
   },
  updateUser:(data, id) => {
    console.log(data);
    return new Promise((resolve,reject) => {
      db.query('UPDATE users SET ? WHERE id= ?', [data, id],
      (err,result) => {
        if (err) {
          reject(new Error(err))
        }else{
          resolve(result)
        }
      })
    })
  },
  updateImage:(data, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET ? WHERE id = ?`, [data, id], (err, res) => {
        if(err) {
          reject(new Error(err))
        }else {
          resolve(res)
        }
      })
    })
  },
  updateVerify: (email) => {
    return new Promise((resolve,reject) => {
      db.query(`UPDATE users SET active = 1 WHERE email='${email}'`,
      (err,result) =>{
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(result);
        }
      })
    })
  },
  deleteUsers: (id) => {
    return new Promise((resolve,reject) => {
      db.query(`DELETE FROM users WHERE id=${id}`, (err,result) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(result);
        }
      })
    })
  },
  deleteMsg: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM message WHERE id=${id}`, (err,result) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(result);
        }
      })
    })
  }
}

module.exports = users 