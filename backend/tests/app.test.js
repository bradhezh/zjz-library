const {describe, test, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Note = require('../models/note')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

// start the app (app.listen(portInternal)) and return an api client
const api = supertest(app)

// before each test
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.notesInitial)
  //// equivalent to
  //// in order
  //for (const e of helper.notesInitial) {
  //  await (new Note(e)).save()
  //}
  //// or (in parallel)
  //const promises = helper.notesInitial
  //  .map(e => new Note(e))
  //  .map(e => e.save())
  //await Promise.all(promises)

  await User.deleteMany({})
  for (const e of helper.usersInitial) {
    const passwd = await bcrypt.hash(e.passwd, 10)
    await (new User({
      username: e.username,
      name: e.name,
      passwd,
    })).save()
  }
})

// a group
describe('when there is initially notes in db', () => {
  // a test case
  // "node --test --test-only" (npm test -- --test-only) only executes
  // "test.only"
  //test.only('GET /api/notes: all notes are returned',
  test('getting all notes succeeds',
    async () => {
      const res = await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const notes = res.body

      assert.strictEqual(notes.length, helper.notesInitial.length)
      for (let i = 0; i < notes.length; ++i) {
        assert.strictEqual(notes[i].content, helper.notesInitial[i].content)
        assert.strictEqual(notes[i].important, helper.notesInitial[i].important)
      }
    }
  )

  // a sub-group
  describe('getting a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notes = await helper.getNotesFromDB()
      const i = Math.floor(Math.random() * notes.length)
      const note = notes[i]

      const res = await api
        .get(`/api/notes/${note.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(res.body, note)
    })

    test('fails with 404 if non-existing', async () => {
      const idNonExisting = await helper.getNonExistingNoteId()

      await api
        .get(`/api/notes/${idNonExisting}`)
        .expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
      const idInvalid = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${idInvalid}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      const res = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const note = {
        content: 'async/await simplifies making async calls',
        important: true,
        idUser: res.body[0].id,
      }

      await api
        .post('/api/notes')
        .send(note)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notes = await helper.getNotesFromDB()
      assert.strictEqual(notes.length, helper.notesInitial.length + 1)
      assert(notes.map(e => e.content).includes(note.content))
    })

    test('fails with 400 if data is invalid', async () => {
      await api
        .post('/api/notes')
        .send({
          important: true,
        })
        .expect(400)

      const notes = await helper.getNotesFromDB()
      assert.strictEqual(notes.length, helper.notesInitial.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with 204 if id is valid', async () => {
      const notes = await helper.getNotesFromDB()
      const i = Math.floor(Math.random() * notes.length)
      const note = notes[i]

      await api
        .delete(`/api/notes/${note.id}`)
        .expect(204)

      const notesAfter = await helper.getNotesFromDB()
      assert.strictEqual(notesAfter.length, helper.notesInitial.length - 1)
      assert(!notesAfter.map(e => e.content).includes(note.content))
    })
  })
})

describe('when there is initially users in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const user = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      passwd: 'salainen',
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await helper.getUsersFromDB()
    assert.strictEqual(users.length, helper.usersInitial.length + 1)
    assert(users.map(e => e.username).includes(user.username))
  })

  test('creation fails with a username already taken', async () => {
    const res = await api
      .post('/api/users')
      .send(helper.usersInitial[0])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const users = await helper.getUsersFromDB()
    assert.strictEqual(users.length, 1)
    assert(res.body.error.includes('"username" must be unique'))
  })
})

// after all tests
after(async () => {
  await mongoose.connection.close()
})
