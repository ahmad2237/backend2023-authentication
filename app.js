var express = require("express");
var userRoute = require("./routes/userRoute.js");

const app = express();

app.use(express.json());

//load routes//
app.use("/api/user", userRoute);
module.exports = app;
