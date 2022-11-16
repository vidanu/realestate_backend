const express = require("express");
const router = express.Router();
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/token");
const config = require("../config");
const BuyerModel = require("../models/BuyerModel");

router.get("/", (req, res) => res.send("Buyer Route"));

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password,contact } = req.body;
  // console.log(req.body, "req.body");
  if (!password) {
    return res.json({
      msg: "Password Empty",
    });
  }
  BuyerModel.findOne({ email: email }, async (err, isUser) => {
    if (err) {
      return res.json({
        msg: "Buyer Registeration failed",
        error: err,
      });
    } else if (isUser) {
      if (!isUser.aflag) {
        return res.json({
          msg: "This account has been deactivated",
        });
      } else {
        console.log("Alre");

        return res.json({
          msg: "Email Already Exist",
        });
      }
    } else {
      console.log("Register");
      const hashPassword = await hashGenerator(password);
      const queryData = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
        contact: contact,

        aflag: true,
      };
      BuyerModel.create(queryData, async (err, user) => {
        if (err) {
          return res.json({
            msg: "Buyer Registeration failed",
            error: err,
          });
        } else {
                  return res.json({
            success: true,
            msg: "Buyer Registration Sucessfull",
            userID: user._id,
          });
        }
      });
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  BuyerModel.findOne({ email: email }, async (err, isUser) => {
    if (err) {
      return res.json({
        msg: "Login failed",
        error: err,
      });
    } else if (!isUser) {
      return res.json({
        msg: "This email isn't registered yet",
      });
    } else if (!isUser.aflag) {
      return res.json({
        msg: "This account has been deactivated",
      });
    }
    // else if(!isUser?.verified){      //For Email Verification
    //   return res.json({
    //     msg: "This account hasn't been verified yet",
    //   });
    // }
    else {
      const result = await hashValidator(password, isUser.password);
      if (result) {
        console.log(result, "result");
        const jwtToken = await JWTtokenGenerator({
          id: isUser._id,
          expire: "30d",
        });
        const query = {
          userId: isUser._id,
          firstname: isUser.firstname,
          lastname: isUser.lastname,
          aflag: true,
          token: "JWT " + jwtToken,
          profilePic: isUser.profilePic,
        };
        res.cookie("jwt", jwtToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        console.log("Setting cookie in res");
        // ActiveSessionModel.create(query, (err, session) => {
        //   if (err) {
        //     return res.json({
        //       msg: "Error Occured!!",
        //     });
        //   } else {
        return res.json({
          success: true,
          userID: isUser._id,
          firstname: isUser.firstname,
          lastname: isUser.lastname,
          email: isUser.email,
          contact: isUser.contact,
          token: "JWT " + jwtToken,
          propertyStatus: isUser.propertyStatus,
          propertyPic: isUser.propertyPic,
        });
        //   }
        // });
      } else {
        return res.json({
          msg: "Password Doesn't match",
        });
      }
    }
  });
});

module.exports = router;