const Note = require('../models/note')
const User = require('../models/user')

const notesInitial = [{
  content: 'HTML is easy',
  important: false,
}, {
  content: 'Browser can execute only JavaScript',
  important: true,
}]

const usersInitial = [{
  username: 'bradhezh',
  name: 'Brad Hezh',
  passwd: '123456',
}]

const getNotesFromDB = async () => {
  const notes = await Note.find({})
  // toJSON here only transforms the object as being defined in
  // schemaNote.set('toJSON', {transform: ...})
  return notes.map(e => e.toJSON())
}

const getUsersFromDB = async () => {
  const users = await User.find({})
  return users.map(e => e.toJSON())
}

const getNonExistingNoteId = async () => {
  const note = new Note({
    content: 'willremovethissoon',
  })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

module.exports = {
  notesInitial,
  usersInitial,
  getNotesFromDB,
  getUsersFromDB,
  getNonExistingNoteId,
}
