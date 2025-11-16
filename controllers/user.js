const User = require("../models/user.js");

module.exports.rendersignup = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
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
  }

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success","Welcome to Roopashilpa !You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logout = (req,res, next)=>{
  req.logout((err)=>{
    if(err) {
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  });
}

module.exports.showProfile = async (req, res) => {
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
  }
