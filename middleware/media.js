const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

exports.gfs = async () => {
  let gfs = null;
  const conn = mongoose.connection;
  conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("badge_images");
  });
  return gfs;
}