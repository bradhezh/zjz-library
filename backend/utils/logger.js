const config = require('./config')

const info = (...params) => {
  if (config.NODE_ENV === 'test') {
    return
  }

  console.log(...params)
}

const error = (...params) => {
  if (config.NODE_ENV === 'test') {
    return
  }

  console.error(...params)
}

module.exports = {
  info,
  error,
}
