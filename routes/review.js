const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn, isReviewAuther} = require("../middlewares.js");
const reviewControllers = require("../controllers/reviews.js");

// Post Review route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewControllers.createReview)
);

// Delete Review route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuther,
    wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;