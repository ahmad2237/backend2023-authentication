const mongoose = require("mongoose");

const docsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: File, required: true },
});

const Docs = mongoose.model("Docs", docsSchema);

module.exports = Docs;
