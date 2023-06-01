var express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registrationUser = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    res.send({ status: "failed", massege: "Email already exist" });
  } else {
    if ((name && email && password && password_confirmation, tc)) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          // why can we do it like this
          var newUser = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            tc: tc,
          });
          console.log("newUser", newUser);
          // study lean
          // newUser.lean();
          // await newUser.save();
          const saved_user = await User.findOne({ email: email });
          // Generate JWT token

          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.status(200).send({
            status: "success",
            massege: "Registration success",
            token: token,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({
            massege: "unable to register",
          });
        }
      } else {
        res.send({
          status: "failed",
          massege: "password and confirm password doesnt match",
        });
      }
    } else {
      res.send({ status: "failed", massege: "all fields are required" });
    }
  }
};

module.exports = { registrationUser };
