const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  // you can use mongoose pre hook to bycrypt the password here not in controller. {look into it}
  password: { type: String, required: true, trim: true },
  // trim is use only with string, 
  // you can also give defualt value 

  // never use words that does not have a meaning 
  tc: { type: Boolean, required: true, default: false},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
