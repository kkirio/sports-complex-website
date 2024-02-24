const mongoose = require("mongoose");
const User = require("./user");

const eventSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model("Event", eventSchema);
