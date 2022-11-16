const mongoose = require("mongoose");

const mailSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  propRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RegPropertyModel",
  },
  aflag: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("MailModel", mailSchema);
