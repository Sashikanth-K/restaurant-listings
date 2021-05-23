const httpStatus = require("http-status");
const { Apartment } = require("../models");
const ApiError = require("../utils/ApiError");

const createApartment = async (data) => {
  const apartment = await Apartment.create(data);
  return apartment;
};

const queryApartments = async (filter, options) => {
  const apartments = await Apartment.paginate(filter, options);
  return apartments;
};

module.exports = {
  createApartment,
  queryApartments,
};
