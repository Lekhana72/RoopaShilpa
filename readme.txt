-----Installing depencies-------
npm init 
npm i express
npm i ejs
npm i mongoose

step 1 : creating server 
step 2 : creating DB 

step 3 : Model : Listing 
                title -> "string"
                description -> "string"
                image -> (url) "string"
                price -> number
                location -> string
                country -> string 

# initialize database

// listings → In MongoDB
//   - This is the actual collection name in the database
//   - It stores all the listing documents (actual data)

// Listing → In Node.js (Mongoose model)
//   - Defined in models/listing.js
//   - Used to interact with the MongoDB 'listings' collection
//   - Example: Listing.find({}) fetches all documents from 'listings'

// allListings → In your route + EJS
//   - A JavaScript variable that holds the data fetched from DB
//   - Passed to EJS via res.render()
//   - Used in EJS as <%= allListings %> or in loops like:
//       <% for (let listing of allListings) { %> ... <% } %>

# index Route  ("/listings)
  in this we use <li> to display all title 
  and mongodb automatically get id for each objects
  so we use (listing._id)

# show Route ("/listings/:id")
  we are using array destrucing to get id 
  then we searching by id in mongodb model 
  then render 

   -> we use .toLocaleString("en-In") 
   to display price with commas

# create : New & Create Route
(we use both "get" and "post" method here)
//    const newListing = new Listing(req.body.listing);
     - Listing is your Mongoose model (from models/listing.js).
     - This creates a new document object (not yet saved to MongoDB)

//  await newListing.save();
    - This saves your new document into the MongoDB database.
    - Because .save() is asynchronous, you use await so the code waits until saving finishes before moving to the next line.

# Edit Route 
  - create a edit.ejs 
  - place a value instead of placeholder
  - use listing._id to edit the route 
  - install the package npm i method-override
  - form method ="post" action="/listings/<%= listing._id %>?_method=PUT"
  - for writing query with PUT 
  - GET is used to fetch and show pages/data (safe — doesn’t change anything). - PUT is used to modify/update existing data.

#DELETE Route 
  - create a button inside a form , give method , action with query ?            _method=DELETE
  - in app.js use .findByIdAndDelete()

-------------------------------------------------------------------------


what is ejs-Mate ? 

//run command npm i ejs-mate in terminal