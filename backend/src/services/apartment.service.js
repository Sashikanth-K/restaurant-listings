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

const getApartmentById = async (id) => {
  return Apartment.findById(id);
};

const updateApartmentById = async (apartmentId, updateBody) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }
  Object.assign(apartment, updateBody);
  await apartment.save();
  return apartment;
};

const deleteApartmentById = async (apartmentId) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }
  await apartment.remove();
  return apartment;
};

module.exports = {
  createApartment,
  queryApartments,
  getApartmentById,
  updateApartmentById,
  deleteApartmentById,
};
