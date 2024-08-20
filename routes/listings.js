const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js"); 


// index route listing 
router.get("/", wrapAsync(async(req,res) => {

    let allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
}));

// new listing route
router.get("/new",isLoggedIn, (req, res) => {

    res.render("listings/new.ejs");
});

// create listing and add in DB
router.post("/new",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res) => {

        // let {title, description, image, price, location, country} = req.body;
        let listing = req.body.listing;

        const newListing = new Listing(listing);

        newListing.owner = req.user._id;
        await newListing.save();

        req.flash("success","New Listing Created Successfully!");
        res.redirect("/listings");
    })
);

// Show route
router.get("/:id", wrapAsync(async(req, res) => {

    let {id} = req.params;

    const listing  = await Listing.findById(id)
        .populate({path : "reviews", populate : {
            path : "auther",
        }
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));


// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res) => {

        let {id} = req.params;

        const listing = await Listing.findById(id);

        if(!listing){
            req.flash("error","Listing does not exist!");
            res.redirect("/listings");
        }
    
        res.render("listings/edit.ejs", {listing});
    }
));

// update in dB
router.put("/:id/edit", 
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req,res) => {

        let {id} = req.params;

        await Listing.findByIdAndUpdate(id, {...req.body.listing});

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    })
);


// delete route
router.delete("/:id", 
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res) => {

        let {id} = req.params;

        await Listing.findByIdAndDelete(id);

        req.flash("success", "Listing deleted succesfully");
        res.redirect("/listings");
    }
));



module.exports = router;