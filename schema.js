const Joi = require('joi');

module.exports.listingSchema = Joi.object ({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("",null)


    }).required(),
});



// Validation schema for custom orders (fields come from the form at /custom)
module.exports.orderSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    height: Joi.number().optional(),
    material: Joi.string().required(),
    timeline: Joi.string().required(),
    location: Joi.string().required(),
}).required();