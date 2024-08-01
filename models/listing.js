const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema( {

    title :{ 
        type : String,
        required : true
    },
    description : String,
    image : {
        filename : String,
        url : {
            type : String,
            default : "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
        set : (v) =>
            v === "" 
            ? "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600" : v,
        }
        
    },
    price : Number,
    location : String,
    country : String
} );

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
