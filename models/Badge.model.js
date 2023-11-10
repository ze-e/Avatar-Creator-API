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
    data: {
      type: String,
      required: true
    }, // Binary data for the image
    contentType: {
      type: String,
      required: true
    }, // MIME type of the image
  },
  teacherId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Badge", badgeSchema);