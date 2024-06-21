// create a router
const routerNotes = require('express').Router()
const jwt = require('jsonwebtoken')

const config = require('../utils/config')
const User = require('../models/user')
const Note = require('../models/note')

routerNotes.get('/', async (req, res) => {
  // select
  // populate(...) replaces the "user" filed of the notes with the users being
  // referenced; the reference relationship is recorded in the "Note" schema, so
  // mongoose know it's a user id and then can populate it
  const notes = await Note.find({}).populate('user', {
    // fields of "user" selected
    username: 1,
    name: 1,
  })

  res.json(notes)
})

// ":<param>" in the route defines a parameter to match a variable argument in
// the request path; this parameter (with the value passed from the argument)
// can be accessed via request.params.<param>
routerNotes.get('/:id', async (req, res) => {
  // select by id
  const note = await Note.findById(req.params.id)

  if (!note) {
    // 404: Not Found
    res.status(404).end()
    return
  }
  res.json(note)
})

routerNotes.delete('/:id', async (req, res) => {
  // delete
  await Note.findByIdAndDelete(req.params.id)

  // 204: No Content
  res.status(204).end()
})

routerNotes.put('/:id', async (req, res) => {
  const note = req.body

  // update: {new: true} indicates the updated document should be returned
  // instead of the original one; validators don't run by default
  const updated =
    await Note.findByIdAndUpdate(req.params.id, {
      content: note.content,
      important: Boolean(note.important),
    }, {
      new: true,
      runValidators: true,
      context: 'query',
    })

  res.json(updated)
})

routerNotes.post('/', async (req, res) => {
  const note = req.body

  const decoded = jwt.verify(getTokenFrom(req), config.SECRET)
  if (!decoded.id) {
    return res.status(401).json({
      error: 'token invalid',
    })
  }
  const user = await User.findById(decoded.id)

  // insert: create an object of the model then save it as a document of the
  // collection; validators run by default
  const saved = await (new Note({
    content: note.content,
    important: Boolean(note.important),
    user: user.id,
  })).save()
  user.notes = user.notes.concat(saved._id)
  await user.save()

  // 201: Created
  res.status(201).json(saved)
})

const getTokenFrom = req => {
  // token is included in the request as the authorization header with the
  // scheme: Bearer xxxtokenxxx
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
}

module.exports = routerNotes
