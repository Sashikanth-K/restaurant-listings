const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { apartmentService } = require("../services");

const createApartment = async (req, res, next) => {
  try {
    const apartment = await apartmentService.createApartment(req.body);
    if (!apartment) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Apartment not created"
      );
    }
    res.status(httpStatus.CREATED).send(apartment);
  } catch (error) {
    next(error);
  }
};

const getApartments = async (req, res, next) => {
  try {
    const filter = pick(req.query, [
      "realtorId",
      "numberOfRooms",
      "price",
      "floorArea",
    ]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await apartmentService.queryApartments(filter, options);
    if (!result) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "No Content");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getApartment = async (req, res, next) => {
  try {
    const apartment = await apartmentService.getApartmentById(
      req.params.apartmentId
    );
    if (!apartment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
    }
    res.send(apartment);
  } catch (error) {
    next(error);
  }
};

const updateApartment = async (req, res, next) => {
  try {
    const apartment = await apartmentService.updateApartmentById(
      req.params.apartmentId,
      req.body
    );
    if (!apartment) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Apartment not updated"
      );
    }
    res.send(apartment);
  } catch (error) {
    next(error);
  }
};

const deleteApartment = async (req, res, next) => {
  try {
    await apartmentService.deleteApartmentById(req.params.apartmentId);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApartment,
  getApartments,
  getApartment,
  updateApartment,
  deleteApartment,
};
