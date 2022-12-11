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
      regUser,
      Title,
      HouseType,
      Seller,
      location,
      layoutName,
      landArea,
      Units,
      facing,
      approachRoad,
      builtArea,
      bedRoom,
      bathRoom,
      floorDetails,
      propertyStatus,
      nearTown,
      priceUnit,
      facilities,
      askPrice,
      Description,
      propertyPic,
    } = req.body;
    // console.log("Response :",req.body)
    //Finding user from DB collection using unique userID
    const user = await userModel.findOne({ _id: regUser });
    //Executes is user found
    if (user) {
      const queryData = {
        regUser: regUser,
        Title: Title,
        HouseType: HouseType,
        Seller: Seller,
        location: location,
        layoutName: layoutName,
        landArea: landArea,
        Units: Units,
        facing: facing,
        approachRoad: approachRoad,
        builtArea: builtArea,
        bedRoom: bedRoom,
        bathRoom: bathRoom,
        floorDetails: floorDetails,
        propertyStatus: propertyStatus,
        nearTown: nearTown,
        priceUnit: priceUnit,
        facilities: facilities,
        askPrice: askPrice,
        Description: Description,
        propertyPic: propertyPic,
        status: "Pending",
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
    const { userId, searchText = "" } = req.body;

    const userProperty = await RegPropertyModel.find(
      {
        regUser: userId,
        $or: [
          {
            Title: { $regex: searchText, $options: "i" },
          },
          { askPrice: { $regex: "^" + searchText, $options: "i" } },

          { landArea: { $regex: "^" + searchText, $options: "i" } },
          { Units: { $regex: searchText, $options: "i" } },

          { HouseType: { $regex: "^" + searchText, $options: "i" } },
          { location: { $regex: "^" + searchText, $options: "i" } },
          { facing: { $regex: "^" + searchText, $options: "i" } },
        ],
        aflag: true,
      },
      null
    ).populate([{ path: "regUser", select: "firstname lastname  email" }]);

    if (userProperty && userProperty.length > 0)
      return res.json({ success: true, userProperty: userProperty });
    else return res.json({ msg: "No Property Found" });
  } catch (err) {
    console.log(err);
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
  const { page = 1, limit = 4, searchText } = req.body;
  const skip = (page - 1) * limit;
  RegPropertyModel.find(
    {
      $or: [
        {
          Title: { $regex: searchText, $options: "i" },
        },
        { askPrice: { $regex: "^" + searchText, $options: "i" } },
        { HouseType: { $regex: searchText, $options: "i" } },
        {
          location: { $regex: searchText, $options: "i" },
        },

        { landArea: { $regex: "^" + searchText, $options: "i" } },
        { Units: { $regex: searchText, $options: "i" } },
      ],
      aflag: true,
      status: "Approved",
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
    },
    { limit: limit, skip: skip }
  );
});
router.post("/rangeSearch", async (req, res) => {
  const { searchFrom, searchTo } = req.body;
  RegPropertyModel.find(
    {
      $and: [
        { askPrice: { $gt: searchFrom } },
        { askPrice: { $lt: searchTo } },
      ],
    },
    (err, isUserProp) => {
      if (err) {
        return res.json({
          msg: "Error Occured",
          error: err,
        });
      } else if (!isUserProp) {
        return res.json({
          msg: "No such Property",
        });
      } else {
        return res.json({
          success: true,
          property: isUserProp,
        });
      }
    }
  );
});

router.post("/update", async (req, res) => {
  const {
    pid,
    regUser,
    Title,
    HouseType,
    Seller,
    location,
    layoutName,
    landArea,
    Units,
    facing,
    approachRoad,
    builtArea,
    bedRoom,
    bathRoom,
    floorDetails,
    propertyStatus,
    nearTown,
    priceUnit,
    facilities,
    askPrice,
    Description,
    propertyPic,
    status,
  } = req.body;
  const queryData = {
    regUser: regUser,
    Title: Title,
    HouseType: HouseType,
    Seller: Seller,
    location: location,
    layoutName: layoutName,
    landArea: landArea,
    Units: Units,
    facing: facing,
    approachRoad: approachRoad,
    builtArea: builtArea,
    bedRoom: bedRoom,
    bathRoom: bathRoom,
    floorDetails: floorDetails,
    propertyStatus: propertyStatus,
    nearTown: nearTown,
    priceUnit: priceUnit,
    facilities: facilities,
    askPrice: askPrice,
    Description: Description,
    propertyPic: propertyPic,
    status: status,
    aflag: true,
  };

  RegPropertyModel.findOneAndUpdate(
    { _id: pid },
    queryData,
    (err, userProp) => {
      if (err) {
        return res.json({
          msg: err,
        });
      } else if (userProp) {
        RegPropertyModel.findOne({ regUser: regUser }, (err, isUserProp) => {
          if (err) {
            return res.json({
              msg: "Error Occured",
              error: err,
            });
          } else if (!isUserProp) {
            return res.json({
              msg: "You Can't Update  this Property",
            });
          } else {
            isUserProp.__v = null;
            return res.json({
              success: true,
              msg: "Property Updated Sucessfully",
              userID: isUserProp.regUser,
              PropId: isUserProp._id,
              userProp,
            });
          }
        });
      }
    }
  );
});
module.exports = router;
