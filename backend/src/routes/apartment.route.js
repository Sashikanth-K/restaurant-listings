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

router
  .route("/:apartmentId")
  .get(
    auth("getApartment"),
    validate(apartmentValidation.getApartment),
    apartmentController.getApartment
  )
  .patch(
    auth("updateApartment"),
    validate(apartmentValidation.updateApartment),
    apartmentController.updateApartment
  )
  .delete(
    auth("deleteApartment"),
    validate(apartmentValidation.deleteApartment),
    apartmentController.deleteApartment
  );

module.exports = router;
