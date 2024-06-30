const routerLogin = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const config = require('../config')
const User = require('../models/user')

routerLogin.post('/', async (req, res) => {
  const userinfo = req.body

  const user = await User.findOne({
    username: userinfo.username,
  })
  const verified =
    user && await bcrypt.compare(userinfo.password, user.password)
  if (!verified) {
    return res.status(401).json({
      error: 'username or password invalid',
    })
  }

  const token = jwt.sign({
    id: user.id,
  }, config.SECRET, {
    expiresIn: 60 * 60 * 24,
  })

  res.json({
    ...user.toJSON(),
    token,
  })
})

module.exports = routerLogin
