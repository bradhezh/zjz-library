require('dotenv').config()

// passed via cli
const NODE_ENV = process.env.NODE_ENV

// configured by dotenv (locally) or in hosts such as Render (automatically) or
// Fly.io (fly.toml)
const PORT = process.env.PORT

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

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URL,
  SECRET,
}
