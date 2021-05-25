const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { apartmentService } = require("../services");

const createApartment = async (req, res, next) => {
  try {
    let data = req.body;
    let location = {
      type: "Point",
      coordinates: [data.lng, data.lat],
    };
    data["location"] = location;
    delete data.lng;
    delete data.lat;

    const apartment = await apartmentService.createApartment(data, req.user);
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
    if (req.user.role == "user") {
      req.query["isRented"] = false;
    }

    if (req.user.role == "realtor") {
      req.query["realtorId"] = req.user.id;
    }
    const filter = pick(req.query, [
      "realtorId",
      "numberOfRooms",
      "price",
      "floorArea",
      "isRented",
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

    if (req.user.role == "user") {
      if (apartment.isRented == true) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Permission denied");
      }
    }

    if (req.user.role == "realtor") {
      if (apartment.realtorId != req.user.id) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Permission denied");
      }
    }

    res.send(apartment);
  } catch (error) {
    next(error);
  }
};

const updateApartment = async (req, res, next) => {
  try {
    let data = req.body;

    if (data.lng && data.lat) {
      let location = {
        type: "Point",
        coordinates: [data.lng, data.lat],
      };
      data["location"] = location;
      delete data.lng;
      delete data.lat;
    }

    const apartment = await apartmentService.updateApartmentById(
      req.params.apartmentId,
      data,
      req.user
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
    await apartmentService.deleteApartmentById(
      req.params.apartmentId,
      req.user
    );
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
