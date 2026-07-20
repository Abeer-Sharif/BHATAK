const express = require('express');
const listingRouter = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/error.js')
const { listingSchema} = require('../schema.js');
const listing = require('../models/listing.js');
const { isLoggedIn ,isOwner , validateListing} = require('../middleware.js');
const {index, listingForm, show, create, edit, update, deleteList} = require('../controller/listings.js');
const {storage } = require('../cloudConfig.js');

const multer = require('multer');
const upload = multer({ storage});

listingRouter.route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(create)
);
// listingRouter.post("/", isLoggedIn, (req, res, next) => {
//     upload.single("listing[image]")(req, res, (err) => {
//         if (err) {
//             console.error("UPLOAD ERROR:");
//             console.error(err);
//             return res.status(500).send(err.message);
//         }

//         console.log("Upload successful");
//         console.log(req.file);

//         next();
//     });
// }, validateListing, wrapAsync(create));

//new route(create new listings)
listingRouter.get("/new", isLoggedIn,listingForm);

listingRouter.route("/:id")
    .get(wrapAsync(show))
    .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(update)
).delete( isLoggedIn, isOwner, wrapAsync(deleteList));


//Edit route
listingRouter.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(edit));

module.exports = listingRouter;