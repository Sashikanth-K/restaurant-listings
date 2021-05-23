const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createApartment = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    realtorId: Joi.string().custom(objectId),
    description: Joi.string(),
  }),
};

const getApartments = {
  query: Joi.object().keys({
    name: Joi.string(),
    ownerId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createApartment,
  getApartments,
};
