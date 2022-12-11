const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const propertyModel = require("../models/propertyModel");
const { hashGenerator } = require("../helpers/Hashing");
const { hashValidator } = require("../helpers/Hashing");
const { JWTtokenGenerator } = require("../helpers/token");
const { isAuthenticated } = require("../helpers/safeRoutes");
const router = express.Router();
// const { sendMail } = require("../services/mail.services");
const config = require("../config");
const RegPropertyModel = require("../models/RegPropertyModel");

router.get("/", (req, res) => res.send("User Route"));

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  // console.log(req.body, "req.body");
  if (!password) {
    return res.json({
      msg: "Password Empty",
    });
  }
  userModel.findOne({ email: email }, async (err, isUser) => {
    if (err) {
      return res.json({
        msg: "User Registeration failed",
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

        aflag: true,
      };
      userModel.create(queryData, async (err, user) => {
        if (err) {
          return res.json({
            msg: "User Registeration failed",
            error: err,
          });
        } else {
          return res.json({
            success: true,
            msg: "User Registration Sucessfull",
            userID: user._id,
          });
        }
      });
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email: email }, async (err, isUser) => {
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

router.post("/allProperty", async (req, res) => {
  const { searchText } = req.body;
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

  RegPropertyModel.countDocuments(
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

router.get("/properties", async (req, res) => {
  propertyModel.find({}, null, { limit: 100 }, (err, list) => {
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
  });
});

router.post("/propertydetails", async (req, res) => {
  const { objectId } = req.body;
  // console.log("objectId" + objectId);
  RegPropertyModel.findById(objectId, (err, propertydetails) => {
    if (err) {
      res.json({
        msg: "Oops Error occurred!",
        error: err,
      });
    } else {
      res.json({
        success: true,
        msg: propertydetails,
      });
    }
  });
});

router.put("/edit", async (req, res) => {
  const { email, firstname, lastname } = req.body;
  const queryData = {
    firstname: firstname,
    lastname: lastname,
  };

  userModel.findOneAndUpdate({ email: email }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      userModel.findOne({ email: email }, (err, isUser) => {
        if (err) {
          return res.json({
            msg: "Error Occured",
            error: err,
          });
        } else if (!isUser) {
          return res.json({
            msg: "User not Found",
          });
        } else {
          isUser.password = null;
          isUser.__v = null;
          return res.json({
            success: true,
            userID: isUser._id,
            firstname: isUser.firstname,
            lastname: isUser.lastname,
            email: isUser.email,
            propertyStatus: isUser.propertyStatus,
          });
        }
      });
    }
  });
});
router.put("/updatepwd", async (req, res) => {
  const { email, newpassword } = req.body;
  const queryData = {
    password: newpassword,
  };

  userModel.findOneAndUpdate({ email: email }, queryData, (err, user) => {
    if (err) {
      return res.json({
        msg: err,
      });
    } else if (user) {
      userModel.findOne({ email: email }, (err, isUser) => {
        if (err) {
          return res.json({
            msg: "Error Occured",
            error: err,
          });
        } else if (!isUser) {
          return res.json({
            msg: "User not Found",
          });
        } else {
          isUser.password = null;
          isUser.__v = null;
          return res.json({
            success: true,
            userID: isUser._id,
            password: isUser.newpassword,
            email: isUser.email,
            propertyStatus: isUser.propertyStatus,
          });
        }
      });
    }
  });
});
//
router.post("/allUser", async (req, res) => {
  const { userID } = req.body;
  userModel.find(
    { _id: { $ne: userID } },
    null,
    {
      sort: { firstname: 1 },
    },
    (err, list) => {
      if (err) {
        console.log("allUseruserid", err);

        res.json({
          msg: err,
        });
      } else {
        res.json({
          success: true,
          users: list,
        });
      }
    }
  );
});

router.get("/whoiam", isAuthenticated, async (req, res) => {
  console.log("user id", req.userid);
  return res.json({ success: true, userid: req.userid });
});

router.get("/logout", async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
  });
  return res.json({ success: true });
});

router.post("/verifyEmail", async (req, res) => {
  const { verifyToken } = req.body;

  if (verifyToken) {
    jwt.verify(verifyToken, config.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.json({
          msg: err?.name || "Invalid token",
          err,
        });
      } else {
        const id = decodedToken?.id;
        userModel.findByIdAndUpdate(
          id,
          { verified: true },
          async (err, user) => {
            if (err) {
              console.log("Token error :", err);
              return res.json({
                msg: "Invalid token",
                err,
              });
            } else if (user) {
              return res.json({
                success: true,
                user,
              });
            } else {
              return res.json({
                msg: "Invalid user",
              });
            }
          }
        );
      }
    });
  } else {
    return res.json({
      msg: "Invalid Registeration",
    });
  }
});

router.post("/forgetPassword", async (req, res) => {
  const { email } = req.body;
  userModel.findOne({ email: email }, async () => {
    if (!email) {
      return res.json({
        msg: "Please provide a Valid email",
        error: err,
      });
    } else if (email?.verified) {
      return res.json({
        msg: "This email isn't verified yet",
      });
    } else if (email.aflag) {
      return res.json({
        msg: "This registered email has been deactivated",
      });
    } else {
      const verifyToken = await JWTtokenGenerator({
        id: email,
        expire: "3600s",
      });

      const mailOptions = {
        to: email,
        subject: "Forget Password Rain Computing",
        html:
          '<p>You requested for Reset Password from Rain Computing, kindly use this <a href="' +
          config.FE_URL +
          "/forgot-password?token=" +
          verifyToken +
          '">link</a> to reset your password</p>',
      };
      const mailResult = await sendMail(mailOptions);
      console.log("Mail response", mailResult);
      return res.json({
        success: true,
        msg: "Pleasse check your email to Reset Your Password ",
        email: email,
      });
    }
  });
});

router.post("/verifyForgetPassword", async (req, res) => {
  const { verifyToken, newPassword } = req.body;

  if (verifyToken) {
    jwt.verify(verifyToken, config.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.json({
          msg: err?.name || "Invalid token",
          err,
        });
      } else {
        console.log("decodedToken : ", decodedToken);
        const id = decodedToken?.id;
        const hashPassword = await hashGenerator(newPassword);
        userModel.findOneAndUpdate(
          { email: id, verified: true, aflag: true },
          { password: hashPassword },
          async (err, user) => {
            if (err) {
              console.log("Token error :", err);
              return res.json({
                msg: "Invalid token",
                err,
              });
            } else if (user) {
              return res.json({
                success: true,
                id: user._id,
              });
            } else {
              return res.json({
                msg: "Invalid user",
              });
            }
          }
        );
      }
    });
  } else {
    return res.json({
      msg: "Invalid Action",
    });
  }
});

router.put("/profilePicUpdate", async (req, res) => {
  const { email, propertyPic } = req.body;
  console.log("propic", req.body);
  const queryData = {
    propertyPic: propertyPic,
  };

  RegPropertyModel.findOneAndUpdate(
    { email: email },
    queryData,
    (err, user) => {
      if (err) {
        return res.json({
          msg: err,
        });
      } else if (user) {
        userModel.findOne({ email: email }, (err, isUser) => {
          if (err) {
            return res.json({
              msg: "Error Occured",
              error: err,
            });
          } else if (!isUser) {
            return res.json({
              msg: "User not Found",
            });
          } else {
            isUser.password = null;
            isUser.__v = null;
            return res.json({
              success: true,
              userID: isUser._id,
              firstname: isUser.firstname,
              lastname: isUser.lastname,
              email: isUser.email,
              propertyPic: isUser.propertyPic,
            });
          }
        });
      }
    }
  );
});

module.exports = router;
