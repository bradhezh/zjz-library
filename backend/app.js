// express uses middlewares to handle requests; middlewares can be mounted via
// app.use(...), where if a path (route) is specified, the middleware is valid
// (called) only when the request path matches (start with) the specified
// route; middlewares can also be mounted via app.<method>(...), being valid
// only when the request exactly matches the method and specified route; a
// middleware can pass control to the next (valid) one via next(), in the order
// they are mounted, but next(err) only targets the error handler, which is
// defined with 4 parameters: (err, req, res, next), typically mounted as the
// last middleware; if no error handler found, a default one is used; a router
// is a special middleware, acting as a "mini app" with middlewares mounted too

const express = require('express')
const mongoose = require('mongoose')

// handling errors in middlewares, whose try...catch and next(err) can be
// eliminated if this package has been imported
require('express-async-errors')

//const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const routerUsers = require('./controllers/users')
const routerLogin = require('./controllers/login')
const routerItems = require('./controllers/items')

const app = express()

mongoose.set('strictQuery', false)
logger.info(
  'connecting to',
  config.NODE_ENV === 'production' ? 'database' : config.MONGO_URL
)

// an async function works only if it's waited for; "await" can be used in the
// top level of ES6 modules because the module importing waits for the module
// being imported as an async (if with "await" in it); "await" can't be used in
// the top level of CommonJS modules because the module importing doesn't wait
// for the module being imported as an async (even if with "await" in it);
// although "await" can be used in "(async () => {...})()", it's actually
// meaningless, because the async calling it isn't waited for
//;(async () => {try {
//  await mongoose.connect(config.MONGO_URL)
//  logger.info('connected')
//} catch (err) {
//  logger.error('error connecting to MongoDB:', err.message)
//}})()
mongoose.connect(config.MONGO_URL)
  .then(() => {
    logger.info('connected')

  }).catch(err => {
    logger.error('error connecting to MongoDB:', err.message)
  })

// to support CORS
//app.use(cors())
// serving corresponding files (static) in /dist/ at first for GET requests
app.use(express.static('dist'))
// json-parser, transforming the raw json to an object as req.body; if this
// middleware isn't mounted, req.body is undefined
app.use(express.json())

app.use(middleware.loggerReq)

// overridden by /dist/index.html
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// for checking deployment
app.get('/version', (req, res) => {
  // change this to ensure a new version is deployed
  res.send('0')
})

// only the remaining part of the path after this matching will be matched for
// middlewares of the router
app.use('/api/users', routerUsers)
app.use('/api/login', routerLogin)
app.use('/api/items', routerItems)

app.use(middleware.endpointUnknown)
app.use(middleware.handlerErr)

module.exports = app
