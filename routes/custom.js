const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
// const Listing = require("../models/listing.js");
const Order = require("../models/order.js");
const { isLoggedIn, validateOrder } = require("../middleware.js");


// When this router is mounted with app.use('/custom', orderRouter)
// the route here should be '/' so the final path is '/custom'.
router.get("/",isLoggedIn, wrapAsync(async (req, res) => {
  // render by view name (no need for ./ or .ejs)
  res.render("listings/custom");
}));

// POST /custom - create a new order from form submission
// POST /custom - create a new order from form submission
router.post(
  "/",
  isLoggedIn,
  validateOrder,
  wrapAsync(async (req, res) => {
    const { title, description, height, material, timeline, location } = req.body;

    const newOrder = new Order({ title, description, height, material, timeline, location });
    await newOrder.save();

    req.flash("success", "Your order was successfully submitted");

    // Redirect to PRG-style thank you page with the saved order id
    res.redirect(`/custom/thankyou?id=${newOrder._id}`);
  })
);



// keep /thankyou route simple — redirect to the form if accessed directly
router.get("/thankyou", wrapAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    req.flash("error", "No order specified.");
    return res.redirect("/custom");
  }
  const order = await Order.findById(id);
  if (!order) {
    req.flash("error", "Order not found.");
    return res.redirect("/custom");
  }
  res.render("listings/thankyou", { order });
}));

module.exports = router;