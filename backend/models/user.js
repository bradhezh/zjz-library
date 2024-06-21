const mongoose = require('mongoose')

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    minLength: 4,
    required: true,
    // achieving uniqueness via unique index created for this field; note that
    // if there're already documents with the same field value, mongoose can't
    // create its unique index and can't ensure its uniqueness
    unique: true,
  },
  name: String,
  passwd: String,
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
  }],
})
schemaUser.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
    delete returned.passwd
  },
})

module.exports = mongoose.model('User', schemaUser)
