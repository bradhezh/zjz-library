const routerUsers = require('express').Router()
const bcrypt = require('bcrypt')

const {auth} = require('../utils/auth')
const User = require('../models/user')

const saltround = 10

routerUsers.get('/', auth([
  'admins',
]), async (req, res) => {
  const users = await User.find({})

  res.json(users)
})

routerUsers.get('/id/:id', auth([
  'admins',
]), async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).end()
  }

  res.json(user)
})

routerUsers.get('/name/:username', auth([
  'admins',
]), async (req, res) => {
  const user = await User.findOne({
    username: req.params.username,
  })
  if (!user) {
    return res.status(404).end()
  }

  res.json(user)
})

routerUsers.post('/', async (req, res) => {
  await signin(req, res, [
    'users',
  ])
})

routerUsers.post('/admin', auth([
  'admins',
]), async (req, res) => {
  await signin(req, res, [
    'admins',
  ])
})

routerUsers.delete('/:id', auth([
  'owner',
], User), async (req, res) => {
  const user = res.locals.resource

  await user.deleteOne()

  res.status(204).end()
})

routerUsers.put('/:id', auth([
  'owner',
], User), async (req, res) => {
  const userinfo = req.body
  const user = res.locals.resource

  delete userinfo.roles
  userinfo.password = await bcrypt.hash(userinfo.password, saltround)
  Object.assign(user, userinfo)
  const updated = await user.save()

  res.json(updated)
})

routerUsers.put('/:id/admin', auth([
  'admins',
]), async (req, res) => {
  const userinfo = req.body
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).end()
  }

  userinfo.password = await bcrypt.hash(userinfo.password, saltround)
  Object.assign(user, userinfo)
  const updated = await user.save()

  res.json(updated)
})

const signin = async (req, res, roles) => {
  const userinfo = req.body

  userinfo.password = await bcrypt.hash(userinfo.password, saltround)
  userinfo.roles = roles
  const created = await (new User(userinfo)).save()

  res.status(201).json(created)
}

module.exports = routerUsers
