const express = require("express");
const app = express();

const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");



async function main(){
    await mongoose.connect(mongoURL);
}

main()
.then( () => {
    console.log("Connected to DB");
})
.catch( (err) => {
    console.log(err);
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded( {extended : true} ));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


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

const validateReview = ( req, res, next) => {

    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//  --------- Routes ---------


app.get("/", (req, res) => {
    res.send("Hi, i am root");
});

// index route listing 
app.get("/listings", wrapAsync(async(req,res) => {

    let allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
}));

// new listing route
app.get("/listings/new", (req, res) => {

    res.render("listings/new.ejs");
});

// create listing and and in DB
app.post("/listings/new",
    validateListing,
    wrapAsync(async (req,res) => {

        // let {title, description, image, price, location, country} = req.body;
        let listing = req.body.listing;

        const newListing = new Listing(listing);

        await newListing.save();

        res.redirect("/listings");
    })
);

// Show route
app.get("/listings/:id", wrapAsync(async(req, res) => {

    let {id} = req.params;

    const listing  = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", {listing});
}));


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {

    let {id} = req.params;

    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update in dB
app.put("/listings/:id/edit", 
    validateListing,
    wrapAsync(async (req,res) => {

        let {id} = req.params;

        await Listing.findByIdAndUpdate(id, {...req.body.listing});

        res.redirect(`/listings/${id}`);
    })
);


// delete route
app.delete("/listings/:id", wrapAsync(async (req,res) => {

    let {id} = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));

// Post Review route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review( req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
app.delete("/listings/:id/reviews/:reviewId", 
    wrapAsync( async (req, res) => {

        let {id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);


app.all("*", (req,res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use( (err, req,res, next) => {
    
    let {status = 404, message = "Something went WRONG!"} = err;

    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs", {message});
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});