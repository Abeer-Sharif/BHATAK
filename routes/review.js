const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/error.js')
const { reviewSchema } = require('../schema.js');
const listing = require('../models/listing.js')
const Review = require('../models/reviews.js')
const {validateReview, isLoggedIn, isAuthor} = require('../middleware.js');
const { add, remove } = require('../controller/reviews.js');
//add a review
reviewRouter.post('/', isLoggedIn,validateReview, wrapAsync(add));

//delete review
reviewRouter.delete("/:reviewId", isLoggedIn, isAuthor,wrapAsync(remove));

module.exports = reviewRouter;