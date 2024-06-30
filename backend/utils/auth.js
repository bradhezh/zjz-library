const jwt = require('jsonwebtoken')

const config = require('../config')
const User = require('../models/user')

const auth = (roles, model) => {
  return async (req, res, next) => {
    const decoded = jwt.verify(getTokenFrom(req), config.SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        error: 'user invalid',
      })
    }

    req.user = user
    if (!roles?.length) {
      next()
      return
    }

    if (roles.includes(config.OWNER_ROLE)) {
      const resource = await model.findById(req.params.id)
      if (!resource) {
        return res.status(404).end()
      }
      if (
        user.id !== (model === User ? resource.id : resource.user) &&
        !user.roles.includes(config.ADMIN_ROLE)
      ) {
        return res.status(401).json({
          error: 'permission invalid',
        })
      }
      res.locals.resource = resource
      next()
      return
    }

    if (
      !user.roles.includes(config.ADMIN_ROLE) &&
      !user.roles.some(e => roles.includes(e))
    ) {
      return res.status(401).json({
        error: 'permission invalid',
      })
    }

    next()
  }
}

const getTokenFrom = req => {
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
}

module.exports = {
  auth,
}
