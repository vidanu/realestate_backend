const mongoose = require("mongoose");
const UploadimagesSchema = mongoose.Schema({

    files:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegPropertyModel",
      },
      propertyPic: {
        type: String,
        default: true,
      },
    
      isPropertyPic: { 
        type: Boolean, 
        default: true
     },
      aflag: {
        type: Boolean,
        default: true,
      }

})
module.exports = mongoose.model("UploadimagesModels", UploadimagesSchema);
