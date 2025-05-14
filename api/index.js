const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const staffRoute = require("./routes/staff");
const authRoute = require("./routes/auth");
const leaveRoute = require("./routes/leave");
const path = require("path");
app.use(cors());

dotenv.config();
// console.log("hello");
mongoose
  .connect("mongodb+srv://sangeethae134:Sangeetha%40134@cluster0.i69fbg1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/staff", staffRoute);
app.use("/api/auth", authRoute);
app.use("/api/leave", leaveRoute);
app.use(express.static(path.join(__dirname, "build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(4000, () => {
  console.log("backend server is running ");
});
