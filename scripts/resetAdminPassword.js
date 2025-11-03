"use strict";

const mongoose = require("mongoose");
const User = require("../models/user");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const NEW_PASSWORD = process.argv[2] || process.env.NEW_ADMIN_PASSWORD;

if (!NEW_PASSWORD) {
  console.error("Usage: node scripts/resetAdminPassword.js <newPassword>");
  console.error("Or set NEW_ADMIN_PASSWORD env var.");
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    let user = await User.findOne({ username: "lekhana" });
    if (!user) {
      console.log("Admin user not found — creating new admin user 'lekhana'");
      user = new User({ username: "lekhana", email: "lekhanap712@gmail.com" });
      await User.register(user, NEW_PASSWORD);
      console.log("Admin user created and password set.");
    } else {
      console.log("Admin user found — updating password.");
      // passport-local-mongoose provides setPassword
      await new Promise((resolve, reject) => {
        user.setPassword(NEW_PASSWORD, async (err, userWithHash) => {
          if (err) return reject(err);
          try {
            await userWithHash.save();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
      console.log("Admin password updated.");
    }
  } catch (e) {
    console.error("Error:", e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
