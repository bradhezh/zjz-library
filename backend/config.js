require('dotenv').config()

const config = require('../config')

const NODE_ENV = process.env.NODE_ENV
const NODE_ENV_PRD = 'prod'
const NODE_ENV_TST = 'test'
const NODE_ENV_DEV = 'dev'

const PORT = process.env.PORT || 3000

const MONGO_URL =
  NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL

const SECRET = process.env.SECRET
const SALT = Number(process.env.SALT)

const ADMIN_INITIAL_USERNAME = process.env.ADMIN_INITIAL_USERNAME
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD

module.exports = {
  NODE_ENV,
  NODE_ENV_PRD,
  NODE_ENV_TST,
  NODE_ENV_DEV,
  PORT,
  MONGO_URL,
  SECRET,
  SALT,
  ADMIN_INITIAL_USERNAME,
  ADMIN_INITIAL_PASSWORD,
  USERS_ROUTE: config.USERS_ROUTE,
  LOGIN_ROUTE: config.LOGIN_ROUTE,
  ITEMS_ROUTE: config.ITEMS_ROUTE,
  BY_ID: config.BY_ID,
  BY_NAME: config.BY_NAME,
  BY_USERID: config.BY_USERID,
  BY_USERNAME: config.BY_USERNAME,
  BY_USER: config.BY_USER,
  BY_ADMIN: config.BY_ADMIN,
  BY_CART: config.BY_CART,
  BY_AVAILABLE: config.BY_AVAILABLE,
  BY_OCCUPIED: config.BY_OCCUPIED,
  BY_ID_ADMIN: config.BY_ID_ADMIN,
  BY_ID_OCCUPIED: config.BY_ID_OCCUPIED,
  ADMIN_ROLE: config.ADMIN_ROLE,
  USER_ROLE: config.USER_ROLE,
  OWNER_ROLE: config.OWNER_ROLE,
}
