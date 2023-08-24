const userRoutes = require("./routes/users.routes");
const adminRoutes = require("./routes/admin.routes");
const teacherRoutes = require("./routes/teacher.routes");
const ping = require("./routes/ping.routes");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const updateExistingUsers = require("./migrations/teacherStudentData");

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

// create application/json parser
const jsonParser = bodyParser.json()

app.use(jsonParser);
const cors = require("cors");
app.use(cors());

app.use("/", userRoutes);
app.use("/students", teacherRoutes);
app.use("/admin", adminRoutes);
app.use("/ping", ping);

module.exports = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
