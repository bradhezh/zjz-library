// create a router
const routerItems = require('express').Router()

const config = require('../config')
const {auth} = require('../utils/auth')
const User = require('../models/user')
const Item = require('../models/item')

routerItems.get('/', async (req, res) => {
  const items = await Item.find({})
  const transformed = items.map(e => {
    // toJSON() here only transforms the object as being defined in
    // schemaItem.set('toJSON', {transform: ...})
    const item = e.toJSON()
    item.available = !e.user
    delete item.user
    return item
  })

  res.json(transformed)
})

routerItems.get(config.BY_AVAILABLE, async (req, res) => {
  const items = await Item.find({
    user: {
      $exists: false,
    },
  })

  res.json(items)
})

routerItems.get(config.BY_USER, auth(), async (req, res) => {
  const user = req.user

  const items = await Item.find({
    // id is provided by mongoose, although there's only _id in Mongo documents
    user: user.id,
  })

  res.json(items)
})

routerItems.get(config.BY_ADMIN, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  // populate(...) replaces the "user" filed of the items with the users being
  // referenced; the reference relationship is recorded in the "Item" schema, so
  // mongoose know it's a user id and then can populate it
  const items = await Item.find({}).populate('user', {
    // fields of "user" selected
    username: 1,
    name: 1,
  })

  res.json(items)
})

// ":<param>" in the route defines a parameter to match a variable argument in
// the request path; this parameter (with the value passed from the argument)
// can be accessed via request.params.<param>
routerItems.get(config.BY_USERID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const user = await User.findById(req.params.userid)
  if (!user) {
    // 404: Not Found
    return res.status(404).end()
  }

  const items = await Item.find({
    user: user.id,
  })

  res.json(items)
})

routerItems.get(config.BY_USERNAME, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const user = await User.findOne({
    username: req.params.username,
  })
  if (!user) {
    return res.status(404).end()
  }

  const items = await Item.find({
    user: user.id,
  })

  res.json(items)
})

routerItems.get(config.BY_ID, async (req, res) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(404).end()
  }

  res.json({
    ...item.toJSON(),
    available: !item.user,
    user: null,
  })
})

routerItems.get(config.BY_ID_ADMIN, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(404).end()
  }

  res.json(item)
})

routerItems.post('/', auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const iteminfo = req.body

  // insert: create an object of the model then save it as a document of the
  // collection; validators run by default
  const created = await (new Item(iteminfo)).save()

  // 201: Created
  res.status(201).json(created)
})

routerItems.delete(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const item = await Item.findById(req.params.id)

  if (item) {
    // delete
    await item.deleteOne()
  }

  // 204: No Content
  res.status(204).end()
})

routerItems.put(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const iteminfo = req.body
  const item = await Item.findById(req.params.id)

  Object.assign(item, iteminfo)
  const updated = await item.save()

  res.json(updated)
})

module.exports = routerItems
