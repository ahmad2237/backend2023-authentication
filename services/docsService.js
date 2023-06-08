const { docsService } = require("./index.js");
const path = require("path");
const fs = require("fs");

const fileUploading =  (file) => {
  // console.log("file=>", file);
  var promise = new Promise();
  const uploadPath = "E:/server/uploads";

   promise((resolve, reject) => {
    fs.writeFile(uploadPath, file.buffer, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  fileUploading,
};
