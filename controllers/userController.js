// const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { forgotPassword } = require("../services/userServices.js");
const { userService } = require("../services/index.js");
const { forgotPassword } = require("../services/userServices.js");
require("dotenv").config();
class UserController {
  static userRegistration = async (req, res) => {
    const user = await userService.registerUser(req.body);
    if (user) {
      res.status(200).json({ newUser: user });
    } else {
      res.status(401).json({ message: "User already exists" });
    }
  };

  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userService.login(email, password);
      res.status(200).send({ massege: "Login successfull", user });
    } catch (error) {
      console.log(error);
      res.status(401).send({ message: "Login failed" });
    }
  };

  static forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
      if (email) {
        const resetToken = await forgotPassword(email);
        console.log(resetToken);
        // const user = await User.findOne({ email: email });
        // if (user) {
        //   const secret = user._id + process.env.JWT_SECRET_KEY;
        //   const token = jwt.sign({ userID: user._id }, secret, {
        //     expiresIn: "15m",
        //   });
        //   const link = `http://localhost:8000/api/user/secret/${user._id}/${token}`;
        //   res.status(201).send({
        //     status: "success",
        //     massege: "password email sent... please check you email ",
        //   });
        // } else {
        //   res.send({ status: "failed", massege: "email doesnt exist" });
        // }
      } else {
        res.send({ status: "failed", massege: "email field is required" });
      }
    } catch (err) {
      res.send(err);
    }
  };

  static userPasswordReset = async (req, res) => {
    // const { password, password_confirmation } = req.body;
    // const { id, token } = req.params;

    // const user = await User.findById(id);
    // const secret_key = user._id + process.env.JWT_SECRET_KEY;
    // try {
    //   jwt.verify(token, secret_key);
    //   if (password && password_confirmation) {
    //     if (password !== password_confirmation) {
    //       res.send({
    //         massege: "new password and confirm new password dont match",
    //       });
    //     } else {
    //       const salt = await bcrypt.genSalt(10);
    //       const newHashPassword = await bcrypt.hash(password, salt);
    //       await User.findByIdAndUpdate(user._id, {
    //         $set: { password: newHashPassword },
    //       });
    //       res.status(201).send({
    //         status: "success",
    //         massege: "password reset successfully",
    //       });
    //     }
    //   } else {
    //     res.send("all fields are required");
    //   }
    // } catch (err) {
    //   res.send({ status: "failed", massege: err });
    // }

    try {
      await resetPassword(password, password_confirmation);
      res.status(200).json({
        massege: "password reset successfully",
      });
    } catch (err) {
      res.status().send({ massege: "Invalid or expire reset token" });
    }
  };
}

module.exports = UserController;
