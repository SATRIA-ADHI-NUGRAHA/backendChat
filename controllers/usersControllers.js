// Call Model
const { getAll, register, getEmail, getId, updateVerify, updateRefreshToken, updateUser, deleteUsers, login, updateImage, deleteMsg } = require('../models/usersModels')
// Call Helper
const { success, failed, errorImage, tokenStatus } = require('../helpers/response')
const uploads = require('../helpers/upload')
const nodemailer = require('nodemailer')
// Call Env
const { JWT_REGIS, JWT_PRIVATE, EMAIL, PASSWORDENV, JWT_REFRESH } = require('../helpers/env')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const usersController = {
  // Get All Users
  getAllUsers: (req,res) => {
    getAll() 
    .then((result) => {
      success(res, result, 'Success get all data Users')
    }).catch((err) => {
      failed(res,[], err.message)
    });
  },
  getDetail: (req,res) => {
    const id = req.params.id
    getId(id) 
    .then((result) => {
      success(res, result, 'Success get detail Users')
    }).catch((err) => {
      failed(res,[], err.message)
    });
  
  },
  // Registrasi Users
  registerController: async (req, res) => {
    try {
      const body = req.body
      const salt = await bcrypt.genSaltSync(10)
      const hash = await bcrypt.hash(body.password, salt)
      const usernamefromfullname = body.fullname.replace(/[^0-9a-z]/gi, '')

      const data = {
        fullname: body.fullname,
        username: usernamefromfullname,
        email: body.email,
        password: hash,
        image: 'default.jpg'
      }
      register(data)
        .then((result) => {
          const token = jwt.sign({ email: data.email, username: data.username }, JWT_PRIVATE)
          const output = `
                    <center><h3>Hello ${data.email}</h3>
                    <p>Click link for confirm your email <br> <a href="http://localhost:3001/user/verify/${token}">Activation</a></p></center>
                    `
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: EMAIL,
              pass: PASSWORDENV
            }
          })

          const Mail = {
            from: `"SAN-COMPANY" <${EMAIL}>`,
            to: data.email,
            subject: 'Verification Email',
            text: 'Plaintext version of the message',
            html: output
          }

          transporter.sendMail(Mail)
          success(res, result, 'Please check your email to activation')
        })
        .catch((err) => {
          // console.log(err)
          if (err.message === 'Duplicate entry') {
            failed(res, [], 'Email Already Exist')
          } else {
            failed(res, [], 'Email or Username Already Exist')
          }
        })
    } catch (error) {
      failed(res, [], 'internal server error')
    }
  },
  verify: (req, res) => {
    try {
      const token = req.params.token
      // eslint-disable-next-line no-unused-vars
      jwt.verify(token, JWT_PRIVATE, (err, decode) => {
        if (err) {
          failed(res, [], 'Failed authorization!')
        } else {
          const data = jwt.decode(token)
          const email = data.email
          updateVerify(email).then(() => {
            res.render('index', { email })
          }).catch(err => {
            failed(res, [], err.message)
          })
        }
      })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  login: async (req, res) => {
    try {
      const body = req.body
      login(body)
        .then(async (result) => {
          const results = result[0]
          const hash = results.password
          const userRefreshToken = results.refreshToken
          const correct = await bcrypt.compare(body.password, hash)
          if (correct) {
            if (results.active === 1) {
              jwt.sign(
                {
                  email: results.email,
                  username: results.username
                },
                JWT_PRIVATE,
                { expiresIn: 3600 },(err, token) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (userRefreshToken === null) {
                      const id = results.id
                      const refreshToken = jwt.sign(
                        { id }, JWT_PRIVATE
                      )
                      updateRefreshToken(refreshToken, id)
                        .then(() => {
                          const data = {
                            id: results.id,
                            username: results.username,
                            token: token,
                            refreshToken: refreshToken
                          }
                          tokenStatus(res, data, 'Login Success')
                        }).catch((err) => {
                          failed(res, [], err.message)
                        })
                    } else {
                      const data = {
                        id: results.id,
                        email:results.email,
                        username: results.username,
                        fullname: results.fullname,
                        image: results.image,
                        token: token,
                        refreshToken: userRefreshToken
                      }
                      tokenStatus(res, data, 'Login Success')
                    }
                  }
                }
              )
            } else {
              failed(res, [], 'Need Activation')
            }
          } else {
            failed(res, [], 'Incorrect password! Please try again')
          }
        })
        .catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], `Internal Server Error!`)
    }
  },
  updateUser: (req, res) => {
    const id = req.params.id;
    const data = req.body
    updateUser(data, id)
      .then(result => {
        success(res, result, 'Update data success');
      }).catch(err => {
        failed(res, [], err.message);
      })
  },
  // Update Image
  updateImage:  (req,res) => {
    uploads.single('image') (req,res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          failed(res, [], 'File too large')
        }else{
          failed(res, [], 'File must be jpg jpeg or png')
        }
      }else {
        const id   = req.params.id
        const body = req.body
        body.image = !req.file?'':req.file.filename
        getId(id)
        .then(result => {
          const oldImage = result[0].image
          console.log(oldImage)
          if(body.image !== oldImage) {
            if(oldImage !== 'default.jpg') {
              updateImage(body, id)
              .then(result => {
                success(res, result, 'Update success')
                fs.unlink(`uploads/${oldImage}`, (err) => {
                  if(err) throw err;
                  console.log('Update success')
                })
              }).catch(err => {
                failed(res, [], err.message)
              })
            } else {
              updateImage(body, id)
              .then(result => {
                success(res, result, 'Update success')
              }).catch (err => {
                failed(res, [], err.message)
              })
            }
          }else {
            updateImage(body, id)
            .then(result => {
              success(res, result, 'Update success')
            }).catch(err => {
              failed(res, [], err.message)
            })
          }
        })
      }
    })
  },
  // Controller Delete Users
  deleteControllerUsers: async (req,res) => {
    const id = req.params.id
    try {
      const dataUser = await getId(id)
      // Delete Image
      let oldPath = path.join(__dirname + `/../../uploads/${dataUser[0].image}`);
      fs.unlink(oldPath, function (err) {
        if (err) throw err;
        console.log('Deleted');
      })
      // Delete Users
      const result = await deleteUsers(id)
      success(res, result, 'Delete User success')
    } catch (error) {
      failed(res, [], error.message)
    }
  },
  deleteMsg: async (req, res) => {
    try {
      const id = req.params.id
      const deleteMessage = await deleteMsg(id)
      success(res, deleteMessage, 'Delete Message Success')
    } catch (err) {
      error(res,[],err.message)
    }
  }
}
  
  module.exports = usersController