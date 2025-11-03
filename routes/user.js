const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err) {
          return next(err);
        }
        req.flash("success", "Welcome to RoopaShilpa");
        res.redirect("/listings");

      });
      
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  });

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome to Roopashilpa !You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res, next)=>{
  req.logout((err)=>{
    if(err) {
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
});

// Profile route — show order history
router.get(
  "/users/profile",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    // If admin, show all users' orders in a table
    if (req.user && req.user.username === "lekhana") {
      const users = await User.find({}).populate("orders.listing");
      // collect orders with owner info
      const adminOrders = [];
      users.forEach((u) => {
        (u.orders || []).forEach((o) => {
          adminOrders.push({
            ownerUsername: u.username,
            ownerEmail: u.email,
            order: o,
          });
        });
      });
      return res.render("users/profile", { user: req.user, isAdmin: true, adminOrders });
    }

    const user = await User.findById(req.user._id).populate("orders.listing");
    res.render("users/profile", { user, isAdmin: false });
  })
);

module.exports = router;
