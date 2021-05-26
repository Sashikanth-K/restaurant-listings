const mongoose = require("mongoose");

const faker = require("faker");
const Apartment = require("../../src/models/apartment.model");
const {
  userOne,
  userTwo,
  admin,
  realtorOne,
  realtorTwo,
  insertUsers,
} = require("./user.fixture");

const apartmentOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  floorArea: faker.datatype.number(),
  price: faker.datatype.number(),
  numberOfRooms: faker.datatype.number(),
  location: {
    type: "Point",
    coordinates: [faker.address.longitude(), faker.address.latitude()],
  },
  description: faker.lorem.paragraph(),
  realtorId: realtorOne._id,
  realtor: {
    name: realtorOne.name,
    email: realtorOne.email,
  },
};

const apartmentTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  floorArea: faker.datatype.number(),
  price: faker.datatype.number(),
  numberOfRooms: faker.datatype.number(),
  location: {
    type: "Point",
    coordinates: [faker.address.longitude(), faker.address.latitude()],
  },
  description: faker.lorem.paragraph(),
  realtorId: realtorOne._id,
  realtor: {
    name: realtorOne.name,
    email: realtorOne.email,
  },
};

const insertApartments = async (users) => {
  await Apartment.insertMany(users.map((user) => ({ ...user })));
};

module.exports = {
  insertApartments,
  apartmentOne,
  apartmentTwo,
};
