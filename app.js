const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const CustomizeOrder = require("./models/commissionRequest.js");
const session = require("express-session");
const flash = require("connect-flash");


const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};

app.get("/", async (req, res) => {
  res.render("listings/hero");
  // console.log("I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(res.locals.success);
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// app.post("/commissions", async (req, res) => {
//   try {
//     const newRequest = new CommissionRequest(req.body);
//     await newRequest.save();
//     res
//       .status(200)
//       .json({ message: "Commission request submitted successfully!" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });








// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing ({
//         title : "My new villa",
//         description: "By the beach",
//         price : 22000,
//         location : "bali",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample listing");
//     res.send("Successful");
// });

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;

  // res.send("something went wrong");
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.get("/register",(req, res)=>{
  let {name ="anonymous"} = req.query;
  req.session.name = name;
  res.redirect("/hello");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
