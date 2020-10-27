const express = require ('express')
const http = require ('http')
const socketio = require ('socket.io')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const path = require ('path')
const { PORT } = require ('./helpers/env')
var createError = require('http-errors');

const cors = require('cors')
const db = require('./config/db')
const router = require('./router/router')
const friendsRoute = require('./router/friends')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
const { getAll } = require('./models/usersModels')

app.use(cors())

app.use(express.static('uploads'));

app.use('/user', router)
app.use('/friend', friendsRoute)

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
  console.log('user connect')

  socket.on('get-all-user', () => {
    getAll().then(result => {
      io.emit('list-users', result)
    }).catch(err => {
      console.log(err)
    })
  })

  socket.on('join-room', (payload) => {
    socket.join(payload)
  })

  socket.on('make-private-room', (payload) => {
      socket.join(payload)
  })

  socket.on('send-message', (payload) => {

    const room = payload.room

    db.query(`INSERT INTO message (sender, receiver, message, imageMsg) VALUES ('${payload.username}','${payload.room}','${payload.message}','${payload.image}')`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        io.to(room).emit('list-messages', {
          sender: payload.username,
          receiver: room,
          message: payload.message,
          image: payload.image
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
        console.log(err.message)
      } else {
        //get message from database
        io.to(payload.sender).emit('getHistory', result)
        // console.log(result)
      }
    })
  })

  socket.on('disconected', () => {
    console.log('user disconected')
  })
})

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})