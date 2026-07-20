const listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    const allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.listingForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
        console.log("OWNER:", listings.owner);
    console.log("OWNER TYPE:", typeof listings.owner);
    if (!listings) {
        req.flash("error", 'Listings doesnt exist');
        return res.redirect("/listings");
    }
    console.log(listings)
    res.render("listings/show.ejs", { listings })
}

module.exports.create = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
        })
        .send()
    


    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, '==>', filename);
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing)
    console.log(listing);
    console.log(listing.geometry);
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listings = await listing.findById(id);
        if (!listings) {
        req.flash("error", 'Listings doesnt exist');
        return res.redirect("/listings");
    }
    let ogImgUrl = listings.image.url;
    ogImgUrl = ogImgUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listings, ogImgUrl })
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        listings.image = { url, filename };
        await listings.save();
    }
    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
}

module.exports.deleteList = async (req, res) => {
    let { id } = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash('success','Listing deleted Successfully')
    res.redirect("/listings")
}