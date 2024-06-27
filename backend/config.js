require('dotenv').config()

const config = require('../config')

// passed via cli
const NODE_ENV = process.env.NODE_ENV
const NODE_ENV_PRD = 'production'
const NODE_ENV_TST = 'test'
const NODE_ENV_DEV = 'development'

// configured by dotenv (locally) or in hosts such as Render (automatically) or
// Fly.io (fly.toml)
const PORT = process.env.PORT || 3000

// configured by dotenv (locally) or in hosts such as Render (.env manually
// added as a secret file) or Fly.io (fly secrets set ...)
// DB_URL=mongodb+srv://username:password@cluster0.azez67k.mongodb.net/dbApp?retryWrites=true&w=majority&appName=cluster0
// where "dbApp" is the database name, automatically created if not existing; if
// no database name specified, the default one is used
//const MONGO_URL = process.env.DB_URL
// a different database used in test mode
const MONGO_URL =
  NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL

// the secret for user tokens
const SECRET = process.env.SECRET
// saltround for hash password
const SALT = process.env.SALT

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
  BY_AVAILABLE: config.BY_AVAILABLE,
  BY_ID_ADMIN: config.BY_ID_ADMIN,
  ADMIN_ROLE: config.ADMIN_ROLE,
  USER_ROLE: config.USER_ROLE,
  OWNER_ROLE: config.OWNER_ROLE,
}
