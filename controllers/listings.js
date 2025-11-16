const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "listing you requested does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing created!!");
    res.redirect("/listings");
  }

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("upload","/upload/h_300,w_250");
    res.render("listings/edit", { listing, originalImageUrl });
  };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
   }

    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }

module.exports.quickOrder = async (req, res) => {
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
  }

module.exports.customizeOrder = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    res.render("listings/customize", { listing });
  }

module.exports.createCustomizedOrder = async (req, res) => {
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
  }