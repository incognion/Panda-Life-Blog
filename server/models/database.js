// database.js
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const db = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Blogs',
  })
}

module.exports = { db }