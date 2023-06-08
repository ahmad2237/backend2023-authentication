const { userService } = require("../services/index.js");


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
      console.error(error);
      res.status(401).send({ message: "Login failed" });
    }
  };

  static forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
      if (email) {
        await userService.forgotPassword(email);

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
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    await userService.resetPassword(id, token, password, password_confirmation);
    try {
      res.status(200).json({
        massege: "password reset successfully",
      });
    } catch (err) {
      res.status().send({ massege: "Invalid or expire reset token" });
    }
  };

  //get all users //
  static getAllUsers = async (req, res) => {
    try {
      await userService.getUsers(res);
    } catch (err) {
      res.status(400).json({ massage: "users not find" });
    }
  };
  static getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      let user = await userService.UserById(id);
      res.status(200).json({ massege: "user find successfully", user: user });
    } catch (error) {
      res.status(404).json({ massege: "user not found" });
    }
  };

  static getUserByEmail = async (req, res) => {
    try {
      const { email } = req.params;
      const userByEmail = await userService.findByEmail(email);
      console.log("userByEmail=>", userByEmail);
      if (userByEmail) {
        res
          .status(200)
          .json({ massege: "user find successfully", user: userByEmail });
      } else {
        res.status(404).json({ massege: "user not exist with this email" });
      }
    } catch (err) {
      res.status(404).json({ massege: "user not found", error: err });
    }
  };

  static getUserByName = async (req, res) => {
    const { name } = req.params;

    try {
      const user = await userService.findByName(name);
      console.log("user=>", name);
      return res.json(user);
    } catch (error) {
      console.log(err);
      res.status(500).json({ massege: "user is not found" });
    }
  };


}

module.exports = UserController;
