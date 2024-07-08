const express = require("express");
const router = express.Router();
const userRequestController = require("../controller/userRequestController");
const authController = require("../controller/authController");
const loanController = require("../controller/LoanRequestController");
const predictionController = require("../controller/prediction");
router.post("/login", authController.login);
// Protect all routes after this middleware
router.use(authController.protect);

// Restrict to admin only
router.use(authController.restrictTo("admin"));

// Admin routes
router.get("/requests", userRequestController.getPendingRequests);
router.patch("/requests/:id/approve", userRequestController.approveRequest);
router.get("/loanrequests", loanController.getLoanRequests);
router.get("/predict/:id", predictionController.predict);
//router.patch("/requests/:id/reject", userRequestController.rejectRequest);

module.exports = router;
