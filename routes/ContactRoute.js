const express = require("express");
const router = express.Router();
const UploadimagesModel = require("../models/ContactModel");
const config = require("../config");
const userModel = require("../models/userModel");
const { route } = require("./RegpropertyRoute");

router.get("/", (req, res) => res.send("Contact Route"));

router.post("/upload", async (req, res) =>{
    try{
        const {propertyId}= req.body;
            //   console.log("Response :",req.body)
        UploadimagesModel.find({files:propertyId})
        .populate({
            path: "files",
            select: "propertyPic isPropertyPic",
          })
          .exec((err, flies) => {
            if (err) {
              return res.json({
                msg: err,
              });
            } else {
              return res.json({
                success: true,
                property: flies,
                
              });

            }
          });

    } catch (err) {
        return res.json({ msg: err?.name || err });
      }

});
module.exports = router;