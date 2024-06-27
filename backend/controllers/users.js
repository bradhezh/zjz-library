const routerUsers = require('express').Router()
const bcrypt = require('bcrypt')

const config = require('../config')
const {auth} = require('../utils/auth')
const User = require('../models/user')

routerUsers.get('/', auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const users = await User.find({})

  res.json(users)
})

routerUsers.get(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).end()
  }

  res.json(user)
})

routerUsers.get(config.BY_NAME, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const user = await User.findOne({
    username: req.params.name,
  })
  if (!user) {
    return res.status(404).end()
  }

  res.json(user)
})

routerUsers.post('/', async (req, res) => {
  await signin(req, res, [
    config.USER_ROLE,
  ])
})

routerUsers.post(config.BY_ADMIN, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  await signin(req, res, [
    config.ADMIN_ROLE,
  ])
})

routerUsers.delete('/', auth(), async (req, res) => {
  const user = req.user

  await user.deleteOne()

  res.status(204).end()
})

routerUsers.put('/', auth(), async (req, res) => {
  const user = req.user
  const userinfo = req.body

  delete userinfo.roles
  userinfo.password = await bcrypt.hash(userinfo.password, config.SALT)
  Object.assign(user, userinfo)
  const updated = await user.save()

  res.json(updated)
})

routerUsers.put(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const userinfo = req.body
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).end()
  }

  userinfo.password = await bcrypt.hash(userinfo.password, config.SALT)
  Object.assign(user, userinfo)
  const updated = await user.save()

  res.json(updated)
})

const signin = async (req, res, roles) => {
  const userinfo = req.body

  userinfo.password = await bcrypt.hash(userinfo.password, config.SALT)
  userinfo.roles = roles
  const created = await (new User(userinfo)).save()

  res.status(201).json(created)
}

module.exports = routerUsers
