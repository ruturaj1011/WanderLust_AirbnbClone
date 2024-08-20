const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js"); 

const listingControllers = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingControllers.index)); // index route listing
 

router.route("/new")
    .get(                                              // new listing route
        isLoggedIn, 
        listingControllers.renderNewFrom
    )                                                  
    .post(                                             // create listing and add in DB
        isLoggedIn,
        validateListing,
        wrapAsync(listingControllers.createListing)
    );  

router.route("/:id")
    .get(wrapAsync(listingControllers.showListing))        // Show route
    .delete(                                               // delete route
        isLoggedIn,
        isOwner,
        wrapAsync(listingControllers.destroyListing)
    );

    
router.route("/:id/edit")
    .get(                                                        // edit route
        isLoggedIn,
        isOwner,
        wrapAsync(listingControllers.renderEditForm)
    )
    .put(                                                         // update in dB
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingControllers.updateListing)
    );


module.exports = router;