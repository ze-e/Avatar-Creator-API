const userRoutes = require('./routes/users.routes');
const ping = require("./routes/ping.routes");
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

/* DATABASE */

const isLocal = process.env.ISLOCAL || false;

function connectToDB() {
  console.log("connecting to database...");
  const database = (module.exports = () => {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    const pw = encodeURIComponent(process.env.MONGODB_PW);
    const uri = process.env.MONGODB_URI;

    try {
      mongoose.connect(uri.replace("<MONGODB_PW>", pw), connectionParams);
      console.log("connected to database successfully!");
    } catch (error) {
      console.log(error);
    }
  });

  database();
}

if (isLocal === true) {
  console.log("connecting to local database...");
  mongoose.connect("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
else connectToDB();

/* SERVER */

const app = express();
const port = 3000;

// create application/json parser
var jsonParser = bodyParser.json()

app.use(jsonParser);

app.use("/", userRoutes);
app.use("/ping", ping)

module.exports = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// if (isLocal === true) {
// 	//local host
// 	module.exports = app.listen(port, () => {
//     console.log(`Local server listening on port ${port}`);
//   });
// } else {
// 		module.exports = app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
// }
