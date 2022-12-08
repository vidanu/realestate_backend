const mongoose = require("mongoose");
const regpropertySchema = mongoose.Schema({
  regUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usermodels",
  },
  // category: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "categoryModel",
  // },
  Title: {
    type: String,
  },
  HouseType: {
    type: String,
  },

  Seller: {
    type: String,
  },

  location: {
    type: String,
  },
  layoutName: {
    type: String,
  },
  landArea: {
    type: String,
  },
  Units: {
    type: String,
  },

  facing: {
    type: String,
  },
  approachRoad: {
    type: String,
  },
  builtArea: {
    type: String,
  },
  bedRoom: {
    type: String,
  },
  bathRoom: {
    type: String,
  },
  floorDetails: {
    type: String,
  },
  propertyStatus: {
    type: String,
  },
  nearTown: {
    type: String,
  },
  priceUnit: {
    type: String,
  },
  facilities: {
    type: String,
  },
  askPrice: {
    type: String,
  },
  Description: {
    type: String,
  },
  propertyPic: [
    {
      type: String,
    },
  ],

  isPropertyPic: { type: Boolean, default: true },

  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  aflag: {
    type: Boolean,
  },
});
module.exports = mongoose.model("RegPropertymodels", regpropertySchema);
