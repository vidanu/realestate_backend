const mongoose = require("mongoose");
const regpropertySchema = mongoose.Schema({
  regUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usermodels",
  },

  Housetype: {
    type: String,
  },

  Area: {
    type: String,
  },

  City: {
    type: String,
  },
  Landmark: {
    type: String,
  },

  Seller: {
    type: String,
  },

  PlotSize: {
    type: String,
  },
  Units: {
    type: String,
  },
  Price: {
    type: String,
  },

  propertyPic: [
    {
      type: String,
    },
  ],

  isPropertyPic: { type: Boolean, default: true },

  Description: {
    type: String,
  },
  aflag: {
    type: Boolean,
  },
  status: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("RegPropertymodels", regpropertySchema);
