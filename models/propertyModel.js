const mongoose = require("mongoose");
const propertySchema = mongoose.Schema({
    propertyName: {
    type: String,
    required: true,
  },
  Area: {
    type: String,
    required: true,
  },

  City: {
    type: String,
    required: true,
  },
  Landmark: {
    type: String,
    required: true,
  },

  Price: {
    type: String,
    required: true,
  },
  Seller: {
    type: String,
    required: true,
  },
  propertyConfig: {
    type: String,
    required: true,
  },
  propertySize: {
    type: String,
    required: true,
  },
  Possession: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  
});

module.exports = mongoose.model("Propertymodels", propertySchema);
