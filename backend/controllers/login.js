const routerLogin = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('../utils/config')
const User = require('../models/user')

routerLogin.post('/', async (req, res) => {
  const userinfo = req.body

  const user = await User.findOne({
    username: userinfo.username,
  })
  const verified =
    user && await bcrypt.compare(userinfo.password, user.password)
  if (!verified) {
    // 401: Unauthorized
    return res.status(401).json({
      error: 'username or password invalid',
    })
  }

  // a token digitally signed with the secret, only parties have the secret can
  // generate a valid token
  const token = jwt.sign({
    id: user.id,
  }, config.SECRET, {
    // expiring in 1 hour
    expiresIn: 60 * 60,
  })

  res.status(200).json({
    ...user.toJSON(),
    token,
  })
})

module.exports = routerLogin
