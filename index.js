const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4444


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieParser('ReadingBlogSecure'))
app.use(session({
    secret: 'ReadingBlogSecretSession',
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    saveUninitialized: true,
    resave: true
}))
app.use(flash())
app.use(fileUpload({useTempFiles : true}))

app.set('layout', './layouts/main')
app.set('view engine','ejs')

const routes = require('./server/routes/blogRoutes.js')
app.use('/',routes)


const {db} = require('./server/models/database.js')

db().then(()=>{
    app.listen(PORT,()=> console.log(`Listening on port ${PORT}`))
})
