const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


const validateListing = ( req,res, next) => {

    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}; 


// index route listing 
router.get("/", wrapAsync(async(req,res) => {

    let allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
}));

// new listing route
router.get("/new", (req, res) => {

    res.render("listings/new.ejs");
});

// create listing and add in DB
router.post("/new",
    validateListing,
    wrapAsync(async (req,res) => {

        // let {title, description, image, price, location, country} = req.body;
        let listing = req.body.listing;

        const newListing = new Listing(listing);

        await newListing.save();

        req.flash("success","New Listing Created Successfully!");
        res.redirect("/listings");
    })
);

// Show route
router.get("/:id", wrapAsync(async(req, res) => {

    let {id} = req.params;

    const listing  = await Listing.findById(id).populate("reviews");

    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));


// edit route
router.get("/:id/edit", wrapAsync(async (req,res) => {

    let {id} = req.params;

    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", {listing});
}));

// update in dB
router.put("/:id/edit", 
    validateListing,
    wrapAsync(async (req,res) => {

        let {id} = req.params;

        await Listing.findByIdAndUpdate(id, {...req.body.listing});

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    })
);


// delete route
router.delete("/:id", wrapAsync(async (req,res) => {

    let {id} = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted succesfully");
    res.redirect("/listings");
}));



module.exports = router;