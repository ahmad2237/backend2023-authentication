var express = require("express");
var cors = require("cors");
var userRoute = require("./routes/userRoute.js");

const app = express();

// CORs policy
// app.use(cors ({
//   origin: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// }));
//JSON//
app.use(express.json());

//load routes//
app.use("/api/user", userRoute);


module.exports = app
