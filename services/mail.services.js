require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require("../config");

const sendMail = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: config.MAIL_SERVICE,
      auth: {
        user: config.SENDER_MAIL,
        pass: config.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        console.log("Email sent: " + info.response);

        resolve(true);
      }
    });
  });
};

module.exports = {
  sendMail,
};
