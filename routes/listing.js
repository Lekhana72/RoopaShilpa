const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); 
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

// schema validate
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Index Route
router.route("/")
  .get ( wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isAdmin,
    
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
    // .post(upload.single("listing[!image]"),(req, res)=>{
    //   res.send(req.file);
    // });
// New Route
router.get("/new", isLoggedIn, isAdmin, listingController.renderNewForm);


router.route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isAdmin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
  isLoggedIn,
  isAdmin,
  wrapAsync(listingController.destroyListing)
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAdmin,
  wrapAsync(listingController.editListing)
);


// Quick order
router.post("/:id/order", isLoggedIn, wrapAsync(listingController.quickOrder));

// Customize flow
router.get("/:id/customize",isLoggedIn, wrapAsync(listingController.customizeOrder));

router.post(
  "/:id/customize",
  isLoggedIn,
  wrapAsync(listingController.createCustomizedOrder)
);

module.exports = router;
