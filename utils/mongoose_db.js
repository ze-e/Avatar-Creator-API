const mongoose = require("mongoose");

exports.DB_CONNECT = async () => {
  const pw = encodeURIComponent(process.env.MONGODB_PW);
  const uri = process.env.MONGODB_URI;
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  return await mongoose.connect(uri.replace("<MONGODB_PW>", pw), connectionParams);
};

exports.GET_DB_URI = () => {
  const pw = encodeURIComponent(process.env.MONGODB_PW);
  const uri = process.env.MONGODB_URI;
  return uri.replace("<MONGODB_PW>", pw)
};
