require ('dotenv').config()

module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  PORT: process.env.PORT,
  EMAIL: process.env.EMAIL,
  PASSWORDENV: process.env.PASSWORDENV,
  JWT_REGIS: process.env.JWT_REGIS,
  JWT_PRIVATE: process.env.JWT_PRIVATE,
  JWT_REFRESH: process.env.JWT_REFRESH
}