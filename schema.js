const Joi = require("joi");

// for review
const reviewSchema = Joi.object({

    review : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        comment : Joi.string().required(),
    }).required(),
});

module.exports = {reviewSchema};


// for listing

module.exports.listingSchema = Joi.object( {

    listing : Joi.object( {

        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.object({
            filename: Joi.string(),  // Optional field
            url: Joi.string().allow("", null).uri().default("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600"),  // Default value if not provided
        }).default({
            filename: "",
            url: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
        }),
        price : Joi.number().required().min(1),
        country : Joi.string().required(),
        location : Joi.string().required(),
        reviews: Joi.array().default([]), 

    } ).required(),

} );

// module.exports = {listingSchema};
