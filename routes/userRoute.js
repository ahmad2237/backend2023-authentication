const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

//public route
router.post("/register", userController.userRegistration);

router.post("/login", userController.userLogin);
router.post("/send-reset-password-email", userController.forgetPassword);
router.post("/resetPassword/:id/:token", userController.userPasswordReset);

router.get("/getUsers", userController.getAllUsers);

module.exports = router;
