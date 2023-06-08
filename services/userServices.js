const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userService } = require("./index.js");
require("dotenv").config();

const registerUser = async (body) => {
  const user = await User.findOne({ email: body.email });
  if (user) {
    return null;
    // throw new APIError ({ status: "failed", massege: "User already exists with this email address!" });
  } else {
    if (
      (body.name && body.email && body.password && body.password_confirmation,
      body.tc)
    ) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(body.password, salt);
        // why can we do it like this
        body.password = hashPassword;
        var newUser = await User.create(body);
        const saved_user = await User.findOne({ email: body.email })
          .select("-password -__v")
          .lean();
        return saved_user;
        // const token = jwt.sign(
        //   { userID: saved_user._id },
        //   process.env.JWT_SECRET_KEY,
        //   { expiresIn: "5d" }
        // );
        // res.status(200).send({
        //   status: "success",
        //   massege: "Registration success",
        //   token: token,
        // });
      } catch (error) {
        throw new error("unable to register");
      }
    } else {
      throw new error("all fields are required");
    }
  }
};

const login = async (email, password) => {
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
        return user;
      } else {
        throw new error("Email or password is not valid");
      }
    } else {
      throw new error("you are not a Registered User");
    }
  } else {
    throw new error("All fields are required");
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new error("Email is not exist with this email");
  } else {
    const secret = user._id + process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userID: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:8000/api/user/secret/${user._id}/${token}`;
    if (link) {
      console.log(link);
      res.status(200).send({ message: "success" });
    }
  }
};

const resetPassword = async (id, token, password, password_confirmation) => {
  const user = await User.findById(String(id));
  console.log("user--->", user);

  const secret_key = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, secret_key);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        throw new error("new password and confirm password is not match");
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res.status(200).send({
          status: "success",
          massege: "password reset successfully",
        });
      }
    } else {
      throw new error("all fields are required");
    }
  } catch (err) {
    console.log("err", err);
  }
};
//get all users//
const getUsers = async (res) => {
  console.log("res=>", res);
  const users = await User.find({});
  if (users) {
    res.json(users);
  }
};
const UserById = async (params) => {
  // console.log("params=>", params);
  let user = await User.findById(params);
  console.log("user=>", user);
  if (user) {
    return user;
  }
};
const findByEmail = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      return user;
    }
  } catch (error) {
    throw new error("user by email is not found ");
  }
};

const findByName = async (name) => {
  try {
    const users = await User.find({ name });
    return users;
  } catch (error) {
    throw new error("user is not exist");
  }
};

module.exports = {
  registerUser,
  login,
  forgotPassword,
  resetPassword,
  getUsers,
  UserById,
  findByEmail,
  findByName,
};
