const express = require("express");
const router = express.Router();


// index - users
router.get("/",(req,res)=>{
    res.send("Get for users");
});

// Show - users
router.get("/:id",(req, res)=>{
    res.send("Get for user id ");
});

// POST - users
router.post("/",(req,res)=>{
    res.send("POST for users");
});

// DELETE - users
router.delete("/:id", (req,res)=>{
    res.send("DELETE for user id");
});

module.exports = router;