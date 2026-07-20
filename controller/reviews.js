const listing = require('../models/listing.js');
const Review = require('../models/reviews.js');

module.exports.add = async (req, res, next) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash('success','Review added Successfully')
    res.redirect(`/listings/${listings._id}`)
}

module.exports.remove = async (req, res) => {
    let { id, reviewId } = req.params;
    let updatedListing = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let deletedreview = await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted Successfully')
    res.redirect(`/listings/${id}`);
}