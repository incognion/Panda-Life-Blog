const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const PORT = process.env.PORT || 4000

require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieParser('ReadingBlogSecure'))
app.use(session({
    secret: 'ReadingBlogSecretSession',
    saveUninitialized: true,
    resave: true
}))
app.use(flash())
app.use(fileUpload())

app.set('layout', './layouts/main')
app.set('view engine','ejs')

const routes = require('./server/routes/blogRoutes.js')
app.use('/',routes)

app.listen(PORT,()=> console.log(`Listening on port ${PORT}`))