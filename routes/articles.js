const express = require('express');
const Article = require('../models/article');
const articles = require('../controllers/articles')
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');
const { validateArticle, isLoggedIn, isAuthor} = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
// const passport = require('passport');  redundant as even without importing passport we were able to use .isAuthenticated() bcoz we had already imported it in index.js


//this file is for all the routes that start with /articles but we do not need to write /articles in front of each route
//we can just write / and it will be assumed that it is /articles, its like treating this file as main page 





router.get('/', catchAsync(articles.index))


router.get('/new',isLoggedIn , articles.getNew)


router.post('/new', isLoggedIn, validateArticle, upload.single('cover'), catchAsync(articles.createNew))    


//required User so that only a particular user can edit/deletee his article
router.get('/:id', catchAsync(articles.renderOne))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(articles.editOne))


router.put('/:id', isLoggedIn, isAuthor, validateArticle, catchAsync(articles.updateOne))


router.delete('/:id', isLoggedIn,isAuthor, catchAsync(articles.deleteOne))


router.use((err, req, res, next)=>{
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode)
    res.render('error', {err});
})


module.exports = router;