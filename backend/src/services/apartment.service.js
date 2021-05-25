const httpStatus = require("http-status");
const { Apartment, User } = require("../models");
const ApiError = require("../utils/ApiError");

const createApartment = async (data, user) => {
  if (user.role == "realtor") {
    data.realtorId = user.id;
    data.realtor = {
      name: user.name,
      email: user.email,
    };
  }

  if (user.role == "admin") {
    let realtorUser = await User.findById(data.realtorId);
    if (!realtorUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "Realtor not found");
    }
    data.realtorId = realtorUser.id;
    data.realtor = {
      name: realtorUser.name,
      email: realtorUser.email,
    };
  }
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

const updateApartmentById = async (apartmentId, updateBody, user) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }

  if (user.role == "realtor") {
    if (apartment.realtorId != user.id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Does not have permissions to update other apartments"
      );
    }
  }

  if (user.role == "admin") {
    if (updateBody.realtorId && updateBody.realtorId != apartment.realtorId) {
      let realtorUser = await User.findById(updateBody.realtorId);
      if (!realtorUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "Realtor not found");
      }
      updateBody.realtorId = realtorUser.id;
      updateBody.realtor = {
        name: realtorUser.name,
        email: realtorUser.email,
      };
    }
  }

  Object.assign(apartment, updateBody);
  await apartment.save();
  return apartment;
};

const deleteApartmentById = async (apartmentId, user) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }
  if (user.role == "realtor") {
    if (apartment.realtorId != user.id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Does not have permissions to delete other apartments"
      );
    }
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
