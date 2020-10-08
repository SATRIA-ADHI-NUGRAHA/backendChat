const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { success, failed, successWithMeta, errorImage } = require('../helpers/reponse')

// Call Env
const { JWT_REGIS, JWT_PRIVATE, EMAIL, PASSWORDENV, JWT_REFRESH } = require('./env')

const sendingEmail = {
   // Send Email
   emailSend: (email) => {
    const hasJwt = jwt.sign({ email: email }, JWT_REGIS)
    let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        // ENV EMAIL PASSWORD 
        user: EMAIL,
        pass: PASSWORDENV
      }
    })
    let mailOptions = {
      from: '"👻" <noreply@gmail.com>',
      to: email,
      subject: `Hello ${email} ✔ `,
      html: `Please activation of email ! <br>
      <a href="http://localhost:3000/verify/${hasJwt}"> Activation</a>
      `
    }
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        failed(res, [], err.message)
      } else {
        success(res, response, 'Success Register EMAIL')
      }
    })
   }
}
module.exports = sendingEmail