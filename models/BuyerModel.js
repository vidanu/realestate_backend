const mongoose = require("mongoose");

const buyerSchema = mongoose.Schema({
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
  password: {
    type: String,
    required: true,
  },
  contact : {
    type :Number,
  },
    aflag: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});
 
module.exports = mongoose.model("buyermodels", buyerSchema);
