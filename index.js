const express = require ('express')
const http = require ('http')
const socketio = require ('socket.io')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require ('path')
const { PORT } = require ('./helpers/env')
var createError = require('http-errors');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const session = require("express-session");

const cors = require('cors')
const db = require('./config/db')
const router = require('./router')

const app = express()
app.use(bodyParser.json())
app.use(cors())
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}))
// app.use(cookieParser());
app.use(router)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
const {  } = require('./models/usersModels')

// catch 404 and forward to error handler
// appcode .


// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
  console.log('connect')
  socket.on('get-all-user', () => {
    db.query(`SELECT * FROM users`, (err, result) => {
      if(err) {
        console.log(err)
      } else {
        io.emit('list-users', result)
      }
    })
  })

  socket.on('send-message', (payload) => {
    // console.log(payload)
    const message = `${payload.sender} : ${payload.message}`
    db.query(`INSERT INTO message (sender, receiver, message) VALUES ('${payload.sender}','${payload.receiver}','${message}')`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        io.to(payload.receiver).emit('list-messages', {
          sender: payload.sender,
          receiver: payload.receiver,
          message: message
        })
      }
    })
  })

  //reques get message from database
  socket.on('get-history-message', (payload) => {
    // console.log(payload)
    db.query(`SELECT * FROM message 
    WHERE (sender='${payload.sender}' AND receiver='${payload.receiver}') OR (sender='${payload.receiver}' AND receiver='${payload.sender}')`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        //get message from database
        io.to(payload.sender).emit('get', result)
        // console.log(result)
      }
    })
  })

  socket.on('join-room', (payload) => {
    socket.join(payload.users)
  })
  // console.log('user connected')

  // socket.on('send-message', (payload) => {
  //   const room = payload.room
  //   io.to(room).emit('get-message', `${payload.username} : ${payload.message}`)
  // })

  // // socket.on('notification', (username) => {
  // //   socket.broadcast.emit('get-notification', `${username} sudah masuk`)
  // // })

  // socket.on('join-room', (payload) => {
  //   console.log(payload)
  //   const room = payload.room
  //   const username = payload.username
  //   socket.join(room)
  //   socket.broadcast.to(room).emit('get-notification', `${username} sudah masuk di room ${room}`)
  // })

  socket.on('disconected', () => {
    console.log('user disconected')
  })
})

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})