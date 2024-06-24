const mongoose = require('mongoose')

// the collection is given a schema (used to validating) at the application
// level by mongoose, although it's schemaless by default in Mongo
const schemaItem = new mongoose.Schema({
  name: {
    type: String,
    minLength: 6,
    required: true,
  },
  // mongoose uses this field to populate
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})
// how objects are transformed to JSON
schemaItem.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
  },
})

// corresponding to the items collection in the database
module.exports = mongoose.model('Item', schemaItem)
