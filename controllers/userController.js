// const express = require("express");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// var registrationUser = require("../services/userServices.js");

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    console.log("req.body", req.body);
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

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await User.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT Token
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Success",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a Registered User",
          });
        }
      } else {
        res.send({ status: "failed", message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };
  static forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        const user = await User.findOne({ email: email });
        if (user) {
          const secret = user._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ userID: user._id }, secret, {
            expiresIn: "15m",
          });
          const link = `http://localhost:8000/api/user/secret/${user._id}/${token}`;
          console.log(link);
          res.status(201).send({
            status: "success",
            massege: "password email sent... please check you email ",
          });
        } else {
          res.send({ status: "failed", massege: "email doesnt exist" });
        }
      } else {
        res.send({ status: "failed", massege: "email field is required" });
      }
    } catch (err) {
      res.send(err);
    }
  };

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await User.findById(id);
    const secret_key = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, secret_key);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            massege: "new password and confirm new password dont match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await User.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.status(201).send({
            status: "success",
            massege: "password reset successfully",
          });
        }
      } else {
        res.send("all fields are required");
      }
    } catch (err) {
      res.send({ status: "failed", massege: err });
    }
  };
}

module.exports = UserController;
