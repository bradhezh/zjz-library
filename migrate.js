const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const config = require('./backend/config')
const logger = require('./backend/utils/logger')
const Item = require('./backend/models/item')
const User = require('./backend/models/user')

// sample items, shouldn't be included for real production deployment
const items = [{
  name: 'The C Programming Language',
  author: 'Brian W. Kernighan, Dennis M. Ritchie',
  content: 'Content of the book',
}, {
  name: 'Computer Organization and Design',
  author: 'David A. Patterson, John L. Hennessy',
  content: 'Content of the book',
}, {
  name: 'Structure and Interpretation of Computer Programs',
  author: 'Harold Abelson, Gerald Jay Sussman, Julie Sussman',
  content: 'Content of the book',
}, {
  name: 'Understanding the Linux Kernel',
  author: 'Daniel P. Bovet, Marco Cesati',
  content: 'Content of the book',
}]

;(async () => {try {
  mongoose.set('strictQuery', false)
  logger.info(
    'connecting to',
    config.NODE_ENV !== config.NODE_ENV_PRD ? config.MONGO_URL : 'database'
  )
  await mongoose.connect(config.MONGO_URL)
  logger.info('connected')

  const users = await User.find({})
  if (users.length) {
    await mongoose.connection.close()
    return
  }

  const password = await bcrypt.hash(config.ADMIN_INITIAL_PASSWORD, config.SALT)
  await (new User({
    username: config.ADMIN_INITIAL_USERNAME,
    password,
    roles: [
      config.ADMIN_ROLE,
    ],
  })).save()

  // sample items, shouldn't be included for real production deployment
  await Item.insertMany(items)

  await mongoose.connection.close()

} catch (err) {
  logger.error('MongoDB error:', err.message)
  await mongoose.connection.close()
}})()
