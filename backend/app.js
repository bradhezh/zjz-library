const express = require('express')
const mongoose = require('mongoose')

require('express-async-errors')

const config = require('./config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const routerUsers = require('./controllers/users')
const routerLogin = require('./controllers/login')
const routerItems = require('./controllers/items')

const app = express()

mongoose.set('strictQuery', false)
logger.info(
  'connecting to',
  config.NODE_ENV !== config.NODE_ENV_PRD ? config.MONGO_URL : 'database'
)

mongoose.connect(config.MONGO_URL)
  .then(() => {
    logger.info('connected')

  }).catch(err => {
    logger.error('connecting to MongoDB failed:', err.message)
  })

app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.loggerReq)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/version', (req, res) => {
  res.send('0')
})

app.use(config.USERS_ROUTE, routerUsers)
app.use(config.LOGIN_ROUTE, routerLogin)
app.use(config.ITEMS_ROUTE, routerItems)

app.use(middleware.endpointUnknown)
app.use(middleware.handlerErr)

module.exports = app
