// Call Model
const { getAll,register, getEmail,getId,updateVerify,updateUsers,deleteUsers, login } = require('../models/usersModels')
// Call Helper
const { success, failed,errorImage } = require('../helpers/reponse')
const { emailSend } = require('../helpers/sendEmail')
const uploads = require('../helpers/upload')
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
  getDetailController: (req,res) => {
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
    const body = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(body.password, salt)
    const data = {
      username: body.username,
      email: body.email,
      password: hashPassword,
      image: 'default.jpg'
      }
      try {
        // Check Email
        const email = await getEmail(data.email)
        if (email.length>0) {
          failed(res, [], 'Email already exist')
        }else{
          // Register Email
          const result = await register(data)
          emailSend(data.email)
          success(res, result , 'Success Registration')
        }
      } catch (error) {
        // Failed Email
          failed(res, [], error.message)
        }
      },
      // Verifikasi Email
      verify: (req,res) => {
        const token = req.params.token
        if (token) {
          jwt.verify(token,JWT_REGIS, async (err,decode) => {
            if (err) {
              failed(res, [], err.message)
            }else{
              try {
            const decodeEmail = decode.email
            const result = await updateVerify(decodeEmail)
            if (result) {
              // success(res, result.email, 'Congratulations your email has been actived')
              res.render("verify/email",);
            }else{
              res.json({
                message: 'Error actived'
              })
            }
          } catch (error) {
            failed(res, [], err.message)
          }
        }
        })
      }
    },
    // login: async(req, res) => {
    //   const body = req.body
    //   login(body)
    //   .then(async(result) => {
    //       const results = result[0]
    //       const password = results.password
    //       const isMatch = await bcrypt.compare(body.password, password)
    //       if(isMatch){
    //         const email = {email: results.email}
    //         const refreshToken = jwt.sign(email, JWT_REFRESH)
    //         refreshToken.push(refreshToken)
    //         const token = generateToken(email)
            
    //         const dataToken = { 
    //           token,
    //           refreshToken 
    //         }
    //         success(res, dataToken, 'Login Success')
    //       }else{
    //         failed(res, [], 'Wrong password/email')
    //       }
    //   })
    //   .catch((err) => {
    //       failed(res, [], err.message)
    //   })
    // },
    loginController: async (req, res) => {
      try {
        const {email,password } = req.body
        const findEmail = await getEmail(email)
        const id = findEmail[0].id
        const emails = findEmail[0].email
        const reff = findEmail[0].refresh_token
        // console.log(re)
        const status = findEmail[0].status
        const haspassword = findEmail[0].password
        const isMatch = bcrypt.compareSync(password, haspassword)
        const refreshToken = jwt.sign({email: email}, JWT_REFRESH)
        if(status === 0 ){
          res.send({status: "not activated"})
        }
        if(isMatch) {
          jwt.sign(
            { email: email }, JWT_PRIVATE, 
            {expiresIn: 3600},
            function(err, token) {
              if(err){
                res.send(err)
              } else {
                res.json({
                  id:id,
                  message: "berhasil login",
                  tokenLogin: token,
                  refreshToken: refreshToken
                })
              }
            }
            );
        } else {
          res.json({
            message: "Password salah"
          })
        }
      } catch (error) {
        res.send({
          error: error.message
        })
      }
  },
  // Update Users
  updateed:  (req,res) => {
    uploads.single('image') (req,res, async (err) => {
      if (err) {
        if (err.code=== 'LIMIT_FILE_SIZE') {
          errorImage(res, [], 'File too large')
        }else{
          errorImage(res, [], 'File must be jpg | jpeg or png ')
        }
      }else {
        const id   = req.params.id
        const body = req.body
        body.image = !req.file?'':req.file.filename
        try {
          const dataUser = await getEmail(body.email)
          const newImage = body.image 
          console.log(dataUser[0].image);
          if (newImage) {
            // With Image
            if (dataUser[0].image==='default.jpg') {
              // Change img Default
              const results = await updateUsers(body,id)
              success(res, results, 'Update img default success')
            }else{
              // Change img after change default
              const result = await updateUsers(body,id)
              // Delete Image
              let oldPath = path.join(__dirname + `/../../public/img/${dataUser[0].image}`);
              fs.unlink(oldPath, function (err) {
                if (err) throw err;
                console.log('Deleted');
              })
              success(res, result, 'Update User success')
            }
          }else{
            // Without Image
            body.image = dataUser[0].image
            const result = await updateUsers(body,id)
            success(res, result, 'Update Users success')
          }
        } catch (error) {
          failed(res, [], error.message)
        }
      }
    })
  },
  // Controller Delete Users
  deleteControllerUsers: async (req,res) => {
    const id = req.params.id
    try {
      const dataUser = await getId(id)
      // Delete Image
      let oldPath = path.join(__dirname + `/../../public/img/${dataUser[0].image}`);
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
  }
}
  
  module.exports = usersController