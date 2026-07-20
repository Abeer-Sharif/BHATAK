const listing = require('./models/listing');
const ExpressError=require('./utils/error.js')
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/reviews.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", 'User needs to be logged in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async (req,res,  next) => {
        let { id } = req.params;
    let listings = await listing.findById(id);
    if (!listings.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor =async (req,res,  next) => {
        let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    console.log(req.body);

    let { error } = listingSchema.validate(req.body);

    if (error) {
        console.log(error);
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }

    next();
};

module.exports. validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
        
    } else {
        next();
    }
}