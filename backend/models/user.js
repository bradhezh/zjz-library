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
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  roles: [{
    type: String,
    required: true,
  }],
})
schemaUser.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
    delete returned.password
  },
})

module.exports = mongoose.model('User', schemaUser)
