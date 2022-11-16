const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const config = require("./config");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const router = express.Router();
const { GridFsStorage } = require("multer-gridfs-storage");
// const { sendMail } = require("../realestate-back/services/mail.services");
// let to = ` <vidanu11@gmail.com>`;
const create = async () => {
  const app = express();
  //DB connection
  mongoose
    .connect(config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

  //Allowing cors
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      exposedHeaders: ["set-cookie"],
    })
  ); //Body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 500000,
    })
  );

  //Attachment uploading
  let gfs;
  mongoose.connection.on("connected", () => {
    const db = mongoose.connections[0].db;
    gfs = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "attachments",
    });
  });
  //Declaring GridFS storage
  const storage = new GridFsStorage({
    url: config.MONGO_URL,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            //  console.log("Final Step err:", err);
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "attachments",
          };
          //  console.log("Final Step fileInfo:", fileInfo);
          resolve(fileInfo);
        });
      });
    },
  });

  const store = multer({
    storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });
  //Checking file types
  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb("filetype");
  }
  //Attachment middleware
  const uploadMiddleware = (req, res, next) => {
    const upload = store.array("file");
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("file to large");
      } else if (err) {
        //  console.log("m error: ", err);
        if (err === "filetype") return res.status(400).send("file type error");
        return res.send("file upload error");
      }
      next();
    });
  };
  //atatchment upload
  app.post("/upload", uploadMiddleware, async (req, res) => {
    console.log("Files :", req?.files, req?.file);
    const { files } = req;
    return res.json({ success: true, files });
  });

  //Mail
  // router.post("/send", async (req, res) => {
  //   try {
  //     const { firstname, lastname, phoneno, pid, mail } = req.body;

  //     console.log(mail);
  //     const mailOptions = {
  //       from: mail,
  //       to: to,
  //       subject: `Enquiry of property Id: ${pid}`,
  //       html: `<p><strong>
  //         Hello Sir,<br/><br/>
  //   Name    : ${firstname}  ${lastname} <br/>
  //   Contact : ${phoneno} <br/> `,
  //     };
  //     const mailSent = await sendMail(mailOptions);
  //     res.json({ success: true, mailSent });
  //   } catch (err) {
  //     console.log("mailChat err: ", err);
  //     return res.json({ msg: err || config.DEFAULT_RES_ERROR });
  //   }
  // });
  app.get("/file/:id", ({ params: { id } }, res) => {
    if (!id || id === "undefined") return res.status(400).send("no image id");
    const _id = new mongoose.Types.ObjectId(id);
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0)
        return res.status(400).send("no files exist");
      // if a file exists, send the data
      gfs.openDownloadStream(_id).pipe(res);
    });
  });

  //Middleware configuration

  // app.get("/", (req, res) => res.send("Hello"));

  app.use("/api/admin", require("./routes/adminRoute"));
  app.use("/api/user", require("./routes/userRoute"));
  app.use("/api/property", require("./routes/RegpropertyRoute"));
  app.use("/api/buyer", require("./routes/BuyerRoute"));
  app.use("/api/mail", require("./routes/mailRoute"));
  return app;
};

module.exports = {
  create,
};
