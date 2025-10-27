const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
app.get("/",(req, res)=>{
    res.send("Hi, I am root!");
});

app.use(cookieParser("Secretcode"));

app.get("/getsignedcookie", (res,req)=>{
    res.cookies("made-In","India", { signed: true});
    res.send("signed cookie sent");
});

app.get("/verify",(req,res)=>{
    console.log(req.cookies);
    res.send("verified");
});

app.use("/users",users);
app.use("/post",posts);

app.listen(3000, ()=>{
    console.log("server is listening to 3000");
});