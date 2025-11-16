const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

// home route
router.get("/",wrapAsync( async(req,res)=>{
  res.render("./listings/about.ejs");
}));

module.exports = router;