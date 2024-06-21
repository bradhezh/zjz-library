const routerLogin = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('../utils/config')
const User = require('../models/user')

routerLogin.post('/', async (req, res) => {
  const userToVerify = req.body

  const user = await User.findOne({
    username: userToVerify.username,
  })
  const verified =
    user && await bcrypt.compare(userToVerify.passwd, user.passwd)
  if (!verified) {
    // 401: Unauthorized
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  // a token digitally signed with the secret, only parties have the secret can
  // generate a valid token
  const token = jwt.sign({
    username: user.username,
    id: user._id,
  }, config.SECRET, {
    // expiring in 1 hour
    expiresIn: 60 * 60,
  })

  res.status(200).json({
    token,
    username: user.username,
    name: user.name,
  })
})

module.exports = routerLogin
