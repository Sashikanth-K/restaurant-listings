const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  //passport.authenticate("local.register"),
  authController.register
);
router.post(
  "/login",
  validate(authValidation.login),
  passport.authenticate("local.login"),
  authController.login
);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.get(
  "/send-verification-email",
  validate(authValidation.sendEmailVerification),
  authController.sendVerificationEmail
);
router.get(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

module.exports = router;
