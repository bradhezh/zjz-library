const path = require('path')

const logger = require('./logger')

const loggerReq = (req, res, next) => {
  logger.info('method:', req.method)
  logger.info('path:', req.path)
  logger.info('body:', req.body)
  logger.info('----')

  next()
}

const endpointUnknown = (req, res) => {
//  res.status(404).json({
//    error: 'unknown endpoint',
//  })

  res.sendFile(path.join(process.cwd(), 'dist/index.html'))
}

const handlerErr = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'malformatted id',
    })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
    })
  }
  if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({
      error: '"username" must be unique',
    })
  }
  if (
    err.name === 'TypeError' &&
    err.message.includes('Cannot read properties of null (reading \'id\')')
  ) {
    return res.status(400).json({
      error: 'a valid user id is neeed for permission',
    })
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'token invalid',
    })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    })
  }

  next(err)
}

module.exports = {
  loggerReq,
  endpointUnknown,
  handlerErr,
}
