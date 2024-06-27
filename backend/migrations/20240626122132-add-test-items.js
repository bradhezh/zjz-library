// this script adds test items and shouldn't be pushed to GitHub for real
// production deployment

module.exports = {
  async up(db) {
    await db.collection('items').insertMany([{
      name: 'The C Programming Language',
    }, {
      name: 'Computer Organization and Design',
    }, {
      name: 'Structure and Interpretation of Computer Programs',
    }, {
      name: 'Understanding the Linux Kernel',
    }])
  },

  async down(db) {
    await db.collection('items').deleteMany({
      name: {
        $in: [
          'The C Programming Language',
          'Computer Organization and Design',
          'Structure and Interpretation of Computer Programs',
          'Understanding the Linux Kernel',
        ],
      },
    })
  },
};
