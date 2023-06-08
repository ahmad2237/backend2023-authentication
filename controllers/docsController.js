const { docsService } = require("../services/index.js");

const uploadFile = async (req, res) => {
  console.log(req.body, req.files);
  // const file = req.file;
  // console.log("file=>", file);
  // try {
  //   if (!file) {
  //     return res.status(400).send("no file uploaded");
  //   }
  //   const result = docsService.fileUploading(file);
  //   return res
  //     .status(200)
  //     .json({ massege: "file upload successfully", result });
  // } catch (err) {
  //   return res.status(500).json({ massege: "an error occured" });
  // }
  res.status(200).json({ massege: "file upload successfully" });
};
module.exports = {
  uploadFile,
};
