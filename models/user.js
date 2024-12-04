const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Membership = require("../models/membership");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  membership: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
module.exports = mongoose.model("User", userSchema);
