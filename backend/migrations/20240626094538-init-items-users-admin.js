const bcrypt = require('bcrypt')

const config = require('../utils/config')

module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See
    // https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    //await db.collection('albums').updateOne({
    //  artist: 'The Beatles',
    //}, {
    //  $set: {
    //    blacklisted: true,
    //  },
    //})
    await db.createCollection('users')
    const password = await bcrypt.hash(
      config.ADMIN_INITIAL_PASSWORD, config.SALT
    )
    await db.collection('users').insertOne({
      username: config.ADMIN_INITIAL_USERNAME,
      password,
      roles: [config.ADMIN_ROLE],
    })

    await db.createCollection('items')
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    //await db.collection('albums').updateOne({
    //  artist: 'The Beatles',
    //}, {
    //  $set: {
    //    blacklisted: false,
    //  },
    //})
    await db.collection('items').drop()
    await db.collection('users').drop()
  },
}
