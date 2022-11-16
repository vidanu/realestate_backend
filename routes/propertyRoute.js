const express = require("express");
const router = express.Router();
const propertyModel = require("../models/propertyModel");
const config = require("../config");
const RegPropertyModel = require("../models/RegPropertyModel");


router.get("/", (req, res) => res.send("Property Route"));

router.post("/allProperty", async (req, res) => {
    const {  searchText } = req.body;
    // const skip = (page - 1) * limit;
  
    propertyModel.find(
      {
        $or: [
          { Area: { $regex: "^" + searchText, $options: "i" } },
          { Landmark: { $regex: "^" + searchText, $options: "i" } },
          { Seller: { $regex: "^" + searchText, $options: "i" } },
       
        ],
      },
      null,
    //   { skip: skip, },
      (err, list) => {
        if (err) {
          res.json({
            msg: err,
          });
        } else {
          res.json({
            success: true,
            property: list,
          });
        }
      }
    );
  });

  router.post("/propertyCount", async (req, res) => {
    const { searchText } = req.body;
  
    propertyModel.countDocuments(
      {
        $or: [
            { Area: { $regex: "^" + searchText, $options: "i" } },
            { Landmark: { $regex: "^" + searchText, $options: "i" } },
            { Seller: { $regex: "^" + searchText, $options: "i" } },
           
           
          ],
        },
      (err, count) => {
        if (err) {
          res.json({
            msg: err,
          });
        } else {
          res.json({
            success: true,
            count,
          });
        }
      }
    );
  });
  
  // router.get("/properties", async (req, res) => {
  //   RegPropertyModel.find({}, null, { limit: 100 }, (err, list) => {
  //     if (err) {
  //       res.json({
  //         msg: err,
  //       });
  //     } else {
  //       res.json({
  //         success: true,
  //         property: list,
  //       });
  //     }
  //   });
  // });
  

  module.exports = router;

