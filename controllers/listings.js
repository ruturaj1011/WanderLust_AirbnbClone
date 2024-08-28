const Listing = require("../models/listing");
const { geocode } = require('@esri/arcgis-rest-geocoding');


// for index route
module.exports.index = async(req,res) => {

    let allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
};

// for search listings result
module.exports.searchListings = async (req,res) => {
    
    let {countryVal} = req.body;

    // console.log(countryVal);

    let allListings = await Listing.find( {country : countryVal} );

    res.render("listings/index.ejs", {allListings});
}

// for new route -> to render new form
module.exports.renderNewFrom = (req, res) => {

    res.render("listings/new.ejs");
};

// to create listing in db
module.exports.createListing = async (req,res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    let listing = req.body.listing;
    const newListing = new Listing(listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename};

    await newListing.save();

    req.flash("success","New Listing Created Successfully!");
    res.redirect("/listings");
};

// to show listing
module.exports.showListing = async(req, res) => {

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
};

// for edit route -> to render edit form
module.exports.renderEditForm = async (req,res) => {

    let {id} = req.params;

    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }

    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_250,w_350");

    res.render("listings/edit.ejs", {listing, originalImgUrl});
};

// to edit listing details in db
module.exports.updateListing = async (req,res) => {

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};

        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// for delete listing 
module.exports.destroyListing = async (req,res) => {

    let {id} = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted succesfully");
    res.redirect("/listings");
};
