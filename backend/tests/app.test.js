const {describe, test, before, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Item = require('../models/item')
const User = require('../models/user')
const app = require('../app')

const user = {
  username: 'bradhezh',
  name: 'Brad Hezh',
  password: '123456',
  roles: ['users'],
}

const items = [{
  name: 'The C Programming Language',
}, {
  name: 'Understanding the Linux Kernel, 3rd Edition',
}]

// start the app (app.listen(portInternal)) and return an api client
const api = supertest(app)

// a group
describe('when there is an initially user in db', () => {
  // before tests in the group
  before(async () => {
    await User.deleteMany({})
    const password = await bcrypt.hash(user.password, 10)
    await (new User({
      ...user,
      password,
    })).save()
  })

  // a sub-group
  describe('when there is initially items for the user in db', () => {
    before(async () => {
      await Item.deleteMany({})
      const users = await User.find({})
      //await Item.insertMany(items)
      // in order
      for (const e of items) {
        await (new Item({
          ...e,
          user: users[0].id,
        })).save()
      }
      //// in parallel
      //const promises = items
      //  .map(e => new Item({
      //    ...e,
      //    user: users[0].id,
      //  }))
      //  .map(e => e.save())
      //await Promise.all(promises)
    })

    // a test case
    // "node --test --test-only" (npm test -- --test-only) only executes
    // "test.only"
    //test.only('getting all items succeeds',
    test('getting all items succeeds without the user field', async () => {
      const res = await api
        .get('/api/items')
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

// after all tests
after(async () => {
  await mongoose.connection.close()
})
