const routerItems = require('express').Router()

const config = require('../config')
const {auth} = require('../utils/auth')
const User = require('../models/user')
const Item = require('../models/item')

routerItems.get('/', async (req, res) => {
  const items = await Item.find({})

  res.json(items)
})

routerItems.get(config.BY_OCCUPIED, async (req, res) => {
  const users = await User.find({})
  const cart = users.map(e => e.cart).flat()
  const items = cart.concat(users.map(e => e.items).flat())

  res.json(items)
})

routerItems.get(config.BY_ID, auth(), async (req, res) => {
  const user = req.user

  if (
    !user.roles.includes(config.ADMIN_ROLE) &&
    !user.items?.includes(req.params.id)
  ) {
    return res.status(401).json({
      error: 'the resource has not been checked out by this user',
    })
  }
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(404).end()
  }

  res.json({
    ...item.toJSON(),
    content: item.content,
  })
})

routerItems.get(config.BY_ID_OCCUPIED, async (req, res) => {
  const user = await User.findOne({
    $or: [{
      items: {
        $elemMatch: {
          $eq: req.params.id,
        },
      },
    }, {
      cart: {
        $elemMatch: {
          $eq: req.params.id,
        },
      },
    }]
  })

  return res.status(200).json(user ? true : false)
})

routerItems.get(config.BY_USER, auth(), async (req, res) => {
  const user = req.user

  const items = []
  for (const e of user.items) {
    const item = await Item.findById(e)
    items.push(item)
  }

  res.json(items)
})

routerItems.get(config.BY_CART, auth(), async (req, res) => {
  const user = req.user

  const cart = []
  for (const e of user.cart) {
    const item = await Item.findById(e)
    cart.push(item)
  }

  res.json(cart)
})

routerItems.post('/', auth(), async (req, res) => {
  const user = req.user

  user.items = (!user.items ? [] : user.items).concat(user.cart)
  user.cart = []
  await user.save()

  res.status(204).end()
})

routerItems.post(config.BY_ADMIN, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const iteminfo = req.body

  const created = await (new Item(iteminfo)).save()

  res.status(201).json(created)
})

routerItems.delete(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(404).end()
  }

  const user = await User.findOne({
    $or: [{
      items: {
        $elemMatch: {
          $eq: req.params.id,
        },
      },
    }, {
      cart: {
        $elemMatch: {
          $eq: req.params.id,
        },
      },
    }]
  })
  if (user) {
    return res.status(400).json({
      error: 'the resource has been occupied by users',
    })
  }

  await item.deleteOne()

  res.status(204).end()
})

routerItems.put(config.BY_ID, auth([
  config.ADMIN_ROLE,
]), async (req, res) => {
  const iteminfo = req.body

  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(404).end()
  }
  Object.assign(item, iteminfo)
  await item.save()

  res.status(204).end()
})

routerItems.put('/', auth(), async (req, res) => {
  const user = req.user
  const ids = req.body

  for (const e of ids) {
    const item = await Item.findById(e)
    if (!item) {
      return res.status(404).end()
    }
  }
  user.cart = ids
  await user.save()

  res.status(204).end()
})

module.exports = routerItems
