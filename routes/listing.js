const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
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
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

// New Route
router.get("/new", isLoggedIn, isAdmin, (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "listing you requested does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// create Route
router.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing created!!");
    res.redirect("/listings");
  })
);
 


// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Quick order: place an order for this listing (saved to user's profile)
router.post(
  "/:id/order",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Create a simple order record from listing
    const order = {
      listing: listing._id,
      title: listing.title,
      description: listing.description,
      height: req.body.height || null,
      material: req.body.material || null,
      timeline: req.body.timeline || null,
      location: req.body.location || listing.location || null,
      customized: false,
      createdAt: new Date(),
    };

    const user = await User.findById(req.user._id);
    user.orders.push(order);
    await user.save();

    req.flash("success", "Your order placed");
    res.redirect(`/listings/${id}`);
  })
);

// Customize flow: show a small form to customize height/material/location/timeline
router.get(
  "/:id/customize",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/customize", { listing });
  })
);

router.post(
  "/:id/customize",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const { height, material, location, timeline } = req.body;

    const order = {
      listing: listing._id,
      title: listing.title,
      description: listing.description,
      height: height || null,
      material: material || null,
      timeline: timeline || null,
      location: location || null,
      customized: true,
      createdAt: new Date(),
    };

    const user = await User.findById(req.user._id);
    user.orders.push(order);
    await user.save();

    req.flash("success", "Your customized order has been saved to your profile");
    res.redirect(`/users/profile`);
  })
);

module.exports = router;
