const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
        email:{
                type: String,
                required: true
        },
        // orders placed by the user (history)
        orders: [
            {
                listing: {
                    type: Schema.Types.ObjectId,
                    ref: "Listing",
                },
                title: String,
                description: String,
                height: Number,
                material: String,
                timeline: String,
                location: String,
                customized: { type: Boolean, default: false },
                createdAt: { type: Date, default: Date.now },
            },
        ],
});
// this plugin has builtin methods to update password , deltee etc
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);