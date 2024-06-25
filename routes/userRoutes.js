const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);
router.patch("/updateMyPassword", authController.updatePassword);
router.route("/me").get(userController.getMe, userController.getUser);
// router.use(authController.restrictTo("admin"));
// router.route("/:id").get(userController.getUser);
// router.route("/").post(authController.protect, userController.createUser);

module.exports = router;
