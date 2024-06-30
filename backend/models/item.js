const mongoose = require('mongoose')

const schemaItem = new mongoose.Schema({
  name: {
    type: String,
    minLength: 1,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    minLength: 1,
  },
  content: String,
})
schemaItem.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
    delete returned.content
  },
})

module.exports = mongoose.model('Item', schemaItem)
