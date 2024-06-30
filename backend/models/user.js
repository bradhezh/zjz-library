const mongoose = require('mongoose')

const schemaUser = new mongoose.Schema({
  username: {
    type: String,
    minLength: 4,
    required: true,
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
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }],
})
schemaUser.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
    delete returned.password
    delete returned.items
    delete returned.cart
  },
})

module.exports = mongoose.model('User', schemaUser)
