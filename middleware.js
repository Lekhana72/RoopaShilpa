const ExpressError = require("./utils/ExpressError.js");
const { orderSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Validate order payload for POST /custom
module.exports.validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// Admin guard — only allow the configured admin user
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user || req.user.username !== "lekhana") {
    req.flash("error", "You do not have permission to perform that action.");
    return res.redirect("/listings");
  }
  next();
};
