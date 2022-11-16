const express = require("express");
const router = express.Router();
// const RegpropertyModel = require("../models/RegPropertyModel");
const config = require("../config");
const userModel = require("../models/userModel");
const RegPropertyModel = require("../models/RegPropertyModel");
const multer = require("multer");

router.get("/", (req, res) => res.send("Property Route"));

router.post("/Sellproperty", async (req, res) => {
  try {
    //De-Struturing values from request body
    const {
      userID,
      Housetype,
      Seller,
      Area,
      Landmark,
      City,
      Price,
      propertyPic,
      PlotSize,
      Units,
      Description,
    } = req.body;
    // console.log("Response :",req.body)
    //Finding user from DB collection using unique userID
    const user = await userModel.findOne({ _id: userID });
    //Executes is user found
    if (user) {
      const queryData = {
        regUser: userID,
        Housetype: Housetype,
        Seller: Seller,
        Area: Area,
        Landmark: Landmark,
        City: City,
        Price: Price,
        propertyPic: propertyPic,
        PlotSize: PlotSize,
        Units: Units,
        Description: Description,

        aflag: true,
      };
      const isAlreadyRegistered = await RegPropertyModel.find({
        Seller,
      });
      if (isAlreadyRegistered.length > 0) {
        return res.json({ msg: `${Seller} already exist` });
      } else {
        const regProperty = await RegPropertyModel.create(queryData);
        if (regProperty) {
          return res.json({
            success: true,
            msg: "Property Registration Sucessfull",
          });
          const updatedUser = await userModel.findByIdAndUpdate(email, {
            propertyStatus: status,
            lastModified: Date.now(),
          });
        } else {
          return res.json({ msg: "Property Registeration failed" });
        }
      }
    } else {
      return res.json({ msg: "User not found" });
    }
  } catch (err) {
    return res.json({ msg: err?.name || err });
  }
});
router.post("/getpropertyByUserId", async (req, res) => {
  try {
    const { userId, searchText } = req.body;

    const userProperty = await RegPropertyModel.find(
      {
        regUser: userId,
        $or: [
          { Price: { $regex: "^" + searchText, $options: "i" } },
          { Housetype: { $regex: "^" + searchText, $options: "i" } },
          { Area: { $regex: "^" + searchText, $options: "i" } },
          { City: { $regex: "^" + searchText, $options: "i" } },
        ],

        aflag: true,
      },
      null
    ).populate([{ path: "regUser", select: "firstname lastname  email" }]);

    if (userProperty && userProperty.length > 0)
      return res.json({ success: true, userProperty: userProperty });
    else return res.json({ msg: "No Property Found" });
  } catch (err) {
    return res.json({ msg: err || config.DEFAULT_RES_ERROR });
  }
});

// router.post("/getpropertyByUserId", async (req, res) => {
//   try {
//     const { userID } = req.body;
//     RegPropertyModel.find({ regUser: userID })
//       .populate({
//         path: "regUser",
//         select: "firstname lastname email",
//       })
//       .exec((err, isProperty) => {
//         if (err) {
//           return res.json({
//             msg: err,
//           });
//         } else {
//           return res.json({
//             success: true,
//             property: isProperty,
//           });
//         }
//       });
//   } catch (err) {
//     return res.json({ msg: err });
//   }
// });

router.post("/properties", async (req, res) => {
  const { searchText } = req.body;
  RegPropertyModel.find(
    {
      $or: [
        { Price: { $regex: "^" + searchText, $options: "i" } },
        { Housetype: { $regex: "^" + searchText, $options: "i" } },
        { Area: { $regex: "^" + searchText, $options: "i" } },
        { City: { $regex: "^" + searchText, $options: "i" } },
        { Landmark: { $regex: "^" + searchText, $options: "i" } },
        { Seller: { $regex: "^" + searchText, $options: "i" } },
      ],
    },
    null,

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

module.exports = router;
