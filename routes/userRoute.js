const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const docsController = require("../controllers/docsController.js");
const multer = require("multer");
const multerUplaod= multer({
    dest: 'E:/server/uploads/',
})
//public route
router.post("/register", userController.userRegistration);

router.post("/login", userController.userLogin);
router.post("/send-reset-password-email", userController.forgetPassword);
router.post("/resetPassword/:id/:token", userController.userPasswordReset);

router.get("/getUsers", userController.getAllUsers);
router.get("/getUserById/:id", userController.getUserById);
router.get("/getUserByEmail/:email", userController.getUserByEmail);
router.get("/getUserByName/:name", userController.getUserByName);

//upload file
router.post("/uploadFile", multerUplaod.array('file'), docsController.uploadFile);

module.exports = router;
