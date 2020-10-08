const mysql = require('mysql2')
const { HOST, USER, PASSWORD, DATABASE } = require ('../helpers/env')

const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  dateStrings: 'date'
})
db.connect()

module.exports = db