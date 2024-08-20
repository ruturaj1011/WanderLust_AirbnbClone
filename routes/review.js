const express = require("express");
const router = express.Router({mergeParams : true});

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn, isReviewAuther} = require("../middlewares.js");


// Post Review route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync( async (req, res) => {

        let listing = await Listing.findById(req.params.id);

        let newReview = new Review( req.body.review);

        newReview.auther = req.user._id;

        listing.reviews.push(newReview);
        console.log(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    }
));

// Delete Review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuther,
    wrapAsync( async (req, res) => {

        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;