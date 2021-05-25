const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createApartment = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    realtorId: Joi.string().custom(objectId),
    description: Joi.string(),
    floorArea: Joi.number(),
    numberOfRooms: Joi.number(),
    price: Joi.number(),
  }),
};

const getApartments = {
  query: Joi.object().keys({
    name: Joi.string(),
    realtorId: Joi.string().custom(objectId),
    floorArea: Joi.number(),
    numberOfRooms: Joi.number(),
    price: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getApartment = {
  params: Joi.object().keys({
    apartmentId: Joi.string().custom(objectId),
  }),
};

const updateApartment = {
  params: Joi.object().keys({
    apartmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      floorArea: Joi.number(),
      numberOfRooms: Joi.number(),
      realtorId: Joi.string().custom(objectId),
      price: Joi.number(),
      isRented: Joi.boolean(),
    })
    .min(1),
};

const deleteApartment = {
  params: Joi.object().keys({
    apartmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createApartment,
  getApartments,
  getApartment,
  updateApartment,
  deleteApartment,
};
