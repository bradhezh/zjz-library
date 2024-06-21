const mongoose = require('mongoose')

// the collection is given a schema (used to validating) at the application
// level by mongoose, although it's schemaless by default in Mongo
const schemaNote = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
  // mongoose uses this field to populate
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})
// how objects are transformed to JSON
schemaNote.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
  },
})

// corresponding to the notes collection in the database
module.exports = mongoose.model('Note', schemaNote)
