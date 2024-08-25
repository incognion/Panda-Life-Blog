require('../models/database')
const Category = require('../models/Category')
const Blog = require('../models/Blog')
const cloudinary = require('cloudinary').v2

exports.homepage = async(req,resp)=>{
    
    
    try {
        
        const limitNumber = 5
        const categories = await Category.find({}).limit(limitNumber)
        const latest = await Blog.find({}).sort({_id: -1}).limit(limitNumber)
        const technology = await Blog.find({'category': 'Technology'}).limit(limitNumber)
        const management = await Blog.find({'category': 'Management'}).limit(limitNumber)
        const business = await Blog.find({'category': 'Business'}).limit(limitNumber)
        
        const blogger = { latest, technology, management, business }
        // console.log(blogger)
    resp.render('index',{ title: 'Panda Life - Home', categories, blogger })
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }
      
}


// GET /categories
// Categories

exports.exploreCategories = async(req,resp)=>{
    try {
        const limitNumber = 20
        const categories = await Category.find({}).limit(limitNumber)
    resp.render('categories',{ title: 'Panda Life - Categories', categories })
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }  
}


// GET /categories/:id
// Categories by Id

exports.exploreCategoriesById = async(req,resp)=>{
    try {
        let categoryId = req.params.id
        const limitNumber = 20
        const categoryById = await Blog.find({ 'category': categoryId }).limit(limitNumber)
    resp.render('categories',{ title: 'Panda Life - Categories', categoryById, categoryId })
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }  
}


// GET /blog/:id
// Blog

exports.exploreBlog = async(req,resp)=>{
    try {
        let blogId = req.params.id
        const blog = await Blog.findById(blogId)
        
    resp.render('blog',{ title: 'Panda Life - Blogs', blog})
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }  
}


// POST /search
// Search 

exports.searchBlog = async(req, resp) => {
    try {
      let searchTerm = req.body.searchTerm;
      let blog = await Blog.find( { $text: { $search: searchTerm, $diacriticSensitive: true } })
      resp.render('search', { title: 'Reading Blog - Search', blog, searchTerm } )
    } catch (error) {
      resp.status(500).send({message: error.message || "Error Occurred" })
    }
}

// GET /about
// About

exports.aboutBlog = async(req, resp) => {
    try {
      resp.render('about', { title: 'Panda Life - About'} )
    } catch (error) {
      resp.status(500).send({message: error.message || "Error Occurred" })
    }
}


// GET /contact
// Contact

exports.contactBlog = async(req, resp) => {
    try {
      resp.render('contact', { title: 'Panda Life - Contact'} )
    } catch (error) {
      resp.status(500).send({message: error.message || "Error Occurred" })
    }
}

// GET /explore-latest
// Explore Latest

exports.exploreLatest = async(req,resp)=>{
    try {
        const limitNumber = 20
        const blog = await Blog.find({}).sort({ '_id': -1}).limit(limitNumber)
        
    resp.render('explore-latest',{ title: 'Panda Life - Explore Latest Blogs', blog})
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }  
}


// GET /explore-random
// Explore Random

exports.exploreRandom = async(req,resp)=>{
    try {
        let count = await Blog.find().countDocuments()
        let random = Math.floor(Math.random() * count)
        let blog = await Blog.findOne().skip(random).exec()
        // console.log(blog)
    resp.render('explore-random',{ title: 'Panda Life - Read a random blog', blog})
    } catch (error) {
        resp.status(500).send({ message: error.message || "Error Occurred" })
    }  
}


// GET /submit-blog
// Submit Blog

exports.submitBlog = async(req,resp)=>{
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    resp.render('submit-blog',{ title: 'Panda Life - Submit Blog', infoErrorsObj, infoSubmitObj })
}

// POST /submit-blog
// Submit Blog

exports.submitBlogOnPost = async (req, resp) => {
    try {
        let imgUrl = 'https://res.cloudinary.com/panda-life/image/upload/v1724588748/no-image-icon_hg2y7p.png'

        if (req.files && Object.keys(req.files).length > 0) {
            const imageUploadFile = req.files.image;
            const newImageName = Date.now() + imageUploadFile.name;
            const uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            // Move the file to the temporary location
            await new Promise((resolve, reject) => {
                imageUploadFile.mv(uploadPath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Upload the file to Cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(uploadPath, { quality: "auto:low" })
            imgUrl = uploadedResponse.secure_url;

            // console.log('File uploaded to Cloudinary:', imgUrl);
        }

        // Save the blog with or without image URL
        const newBlog = new Blog({
            email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            image: imgUrl
        });

        await newBlog.save();

        req.flash('infoSubmit', 'Your blog has been successfully added');
        resp.redirect('/submit-blog');
    } catch (error) {
        req.flash('infoErrors', error);
        resp.redirect('/submit-blog');
    }
}