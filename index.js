const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
const cloudinary = require('cloudinary').v2
const { db } = require('./server/models/database.js')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 4444
let dbConnected = false

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Middleware setup
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)
app.use(cookieParser('ReadingBlogSecure'))

app.use(
    session({
        secret: 'ReadingBlogSecretSession',
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
        saveUninitialized: true,
        resave: true,
    })
)

app.use(flash())
app.use(fileUpload())

app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// Middleware to handle loading state before DB connects
app.use((req, res, next) => {
    if (!dbConnected) {
        return res.render('loading', { title: 'Loading...' })
    }
    next()
})

// Load routes only after DB is connected
const routes = require('./server/routes/blogRoutes.js')
app.use('/', routes)

// Start server immediately
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

    // Connect to DB in background after delay
    ; (async () => {
        try {
            await db()
            dbConnected = true
            console.log('Database Connected')
        } catch (err) {
            console.error('DB connection failed:', err.message)
        }
    })()