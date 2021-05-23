const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { apartmentValidation } = require("../validations");
const { apartmentController } = require("../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    auth("createApartment"),
    validate(apartmentValidation.createApartment),
    apartmentController.createApartment
  )
  .get(
    auth("getApartments"),
    validate(apartmentValidation.getApartments),
    apartmentController.getApartments
  );

module.exports = router;
