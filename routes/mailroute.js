const express = require("express");

const router = express.Router();
const MailModel = require("../models/Mailmodel");
const { sendMail } = require("../services/mail.services");
const config = require("../config");
const { RECEIVER_MAIL, SENDER_MAIL } = require("../config");

router.post("/mailregister", async (req, res) => {
  const { firstname, lastname, email, phoneno, propRef } = req.body;
  const queryData = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    phoneno: phoneno,
    propRef: propRef,
    aflag: true,
  };
  MailModel.create(queryData, async (err, mail) => {
    if (err) {
      return res.json({
        msg: "Mail details storage  failed",
        error: err,
      });
    } else {
      return res.json({
        success: true,
        msg: "Mail details storage Successful ",
        mailId: mail._id,
      });
    }
  });
});

//Mail
router.post("/send", async (req, res) => {
  try {
    const { firstname, lastname, phoneno, email, propRef } = req.body;

    const mailOptions = {
      from: email,
      to: SENDER_MAIL,
      subject: `Enquiry from  ${firstname} for the property Id: ${propRef}`,
      html: `<p><strong>
          Hello Sir,<br/><br/>
    Name      : ${firstname}  ${lastname} <br/>
    Contact No: ${phoneno} <br/> 
    Mail ID    :${email}</br>`,
    };
    const mailSent = await sendMail(mailOptions);

    res.json({ success: true, mailSent });
    console.log(mailOptions);
  } catch (err) {
    console.log("mailChat err: ", err);
    return res.json({ msg: err || config.DEFAULT_RES_ERROR });
  }
});
module.exports = router;
