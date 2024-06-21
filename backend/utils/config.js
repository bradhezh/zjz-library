require('dotenv').config()

// PORT is a environment variable configured by dotenv (locally) or in hosting
// platforms such as Fly.io (fly.toml) and Render (automatically)
const PORT = process.env.PORT

// MONGO_URL is a environment variable configured by dotenv (locally) or in
// hosting platforms such as Fly.io (fly secrets set) and Render (.env manually
// set as secret files)
// MONGO_URL=mongodb+srv://username:password@cluster0.azez67k.mongodb.net/dbNote?retryWrites=true&w=majority&appName=cluster0
// in the connection string, "dbNote" is the database name, and automatically
// created if not existing; if no database name specified, the default one is
// used
//const MONGO_URL = process.env.MONGO_URL
// a different database used in test mode
const MONGO_URL =
  process.env.NODE_ENV === 'test' ?
    process.env.TEST_DB_URL :
    process.env.DB_URL

const SECRET = process.env.SECRET

module.exports = {
  PORT,
  MONGO_URL,
  SECRET,
}
