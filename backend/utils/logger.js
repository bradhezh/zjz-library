const config = require('../config')

const info = (...params) => {
  if (config.NODE_ENV !== config.NODE_ENV_TST) {
    console.log(...params)
  }
}

const error = (...params) => {
  if (config.NODE_ENV !== config.NODE_ENV_TST) {
    console.error(...params)
  }
}

module.exports = {
  info,
  error,
}
