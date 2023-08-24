const userRoutes = require("./routes/users.routes");
const ping = require("./routes/ping.routes");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

/* DATABASE */

const isLocal = process.env.ISLOCAL || false;

function connectToDB() {
  console.log("connecting to database...");
  const database = (module.exports = async () => {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const pw = encodeURIComponent(process.env.MONGODB_PW);
    const uri = process.env.MONGODB_URI;

    try {
      await mongoose.connect(uri.replace("<MONGODB_PW>", pw), connectionParams);
      console.log("connected to database successfully!");
    } catch (error) {
      console.log(error);
    }
  });

  database();
}

if (isLocal == true) {
  console.log("connecting to local database...");
  async () => await mongoose.connect("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
else connectToDB();

/* SERVER */

const app = express();
const port = process.env.PORT || 3000;

// set up cors
const cors = require("cors");
app.use(cors());
app.options("*", cors()); // enable pre-flight

const rawBodyHandler = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
    console.log("Raw body: " + req.rawBody);
  }
};

app.use(bodyParser.json({ verify: rawBodyHandler }));

app.use("/", userRoutes);
app.use("/ping", ping)

module.exports = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
