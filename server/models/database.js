const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
const db = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: 'Blogs'
        })
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error){
        console.log(error)
        process.exit(1)
    }
}

// Models
require('./Category')
require('./Blog')

module.exports = {db}
