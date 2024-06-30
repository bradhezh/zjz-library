const {describe, test, before, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const config = require('../config')
const Item = require('../models/item')
const User = require('../models/user')
const app = require('../app')

const user = {
  username: 'bradhezh',
  name: 'Brad Hezh',
  password: '123456',
  roles: [
    config.USER_ROLE,
  ],
}

const items = [{
  name: 'The C Programming Language',
}, {
  name: 'Understanding the Linux Kernel, 3rd Edition',
}]

const SALT = 10

const api = supertest(app)

describe('when there is an initially user in db', () => {
  before(async () => {
    await User.deleteMany({})
    const password = await bcrypt.hash(user.password, SALT)
    await (new User({
      ...user,
      password,
    })).save()
  })

  describe('when there is initially items for the user in db', () => {
    before(async () => {
      await Item.deleteMany({})
      const users = await User.find({})
      for (const e of items) {
        await (new Item({
          ...e,
          user: users[0].id,
        })).save()
      }
    })

    test('getting all items by a normal user succeeds without the user field',
    async () => {
      const res = await api
        .get(config.ITEMS_ROUTE)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(res.body.length, items.length)
      for (let i = 0; i < res.body.length; ++i) {
        assert.strictEqual(res.body[i].name, items[i].name)
        assert(!res.body[i].user)
      }
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
