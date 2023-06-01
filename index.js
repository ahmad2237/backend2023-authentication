const app = require("./app");
const http = require("http");
const mongoose = require("mongoose");
let server;
// require("dotenv").config();
let PORT = 5000;
//database connection
//

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log("Connected!");
    server = http.createServer(app);

    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Connection error to db", e);
  });
