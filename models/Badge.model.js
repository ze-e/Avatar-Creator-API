const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer, // Binary data for the image
    contentType: String, // MIME type of the image
  },
  teacherId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Badge", badgeSchema);