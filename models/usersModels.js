const db = require('../config/db')

const users = {
  getAll:() => {
    return new Promise((resolve,reject) => {
     db.query(`SELECT * FROM users`,
     (err, result) => {
       err?reject(new Error(err)): resolve(result)
     })
    })
   },
   register: (data) => {
    return new Promise((resolve,reject) => {
      db.query(`INSERT INTO users (username,email,password,image,active) 
      VALUES('${data.username}','${data.email}','${data.password}','${data.image}','1')`,
      (err,result) => {
        err ? reject(new Error(err)): resolve(result)
      })
    }) 
},
  login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = ?`, data.email, (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        }
      )
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
       err?reject(new Error(err)): resolve(result)
     })
    })
   },
  updateUsers:(data, id) => {
    console.log(data);
    return new Promise((resolve,reject) => {
      db.query(`UPDATE users SET 
      username='${data.username}',
      email='${data.email}',
      phone_number='${data.phone_number}',
      image='${data.image}'
      WHERE id = '${id}'`,
      (err,result) => {
        if (err) {
          reject(new Error(err))
        }else{
          resolve(result)
        }
      })
    })
  },
  updateVerify: (email) => {
    return new Promise((resolve,reject) => {
      db.query(`UPDATE users SET active=1 WHERE email='${email}'`,
      (err,result) =>{
        err?reject(new Error(err)) : resolve(result)
      })
    })
  },
  deleteUsers: (id) => {
    return new Promise((resolve,reject) => {
      db.query(`DELETE FROM users WHERE id=${id}`, (err,result) => {
        err?reject(new Error(err)) : resolve(result)
      })
    })
  }
  }

module.exports = users 