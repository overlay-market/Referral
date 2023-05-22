const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  referralLinks: {
    type: Object,
    required: true,
  },
});

// connect linkSchema with the "links" collection
module.exports = mongoose.model("link", linkSchema);
