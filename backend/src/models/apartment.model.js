const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

/*
name
description,
floor area size,
price per month,
number of rooms,
valid geolocation coordinates,
date added
associated realtor.
*/

const apartmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "A good restaurant",
    },
    floorArea: {
      type: Number,
      default: 0.0,
    },
    numberOfRooms: {
      type: Number,
      default: 0,
    },
    realtor: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
apartmentSchema.plugin(toJSON);
apartmentSchema.plugin(paginate);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;