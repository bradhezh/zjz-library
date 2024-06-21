const routerUsers = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

routerUsers.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  })

  res.json(users)
})

routerUsers.post('/', async (req, res) => {
  const user = req.body
  const saltround = 10
  const passwdHash = await bcrypt.hash(user.passwd, saltround)

  const saved = await (new User({
    username: user.username,
    name: user.name,
    passwd: passwdHash,
  })).save()

  res.status(201).json(saved)
})

module.exports = routerUsers
