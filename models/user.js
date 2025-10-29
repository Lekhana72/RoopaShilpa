const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
});
// this plugin has builtin methods to update password , deltee etc
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);