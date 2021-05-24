const httpStatus = require("http-status");
const { User, Restaurant, Review } = require("../models");
const ApiError = require("../utils/ApiError");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    //throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    throw new Error("Email Already Taken");
  }
  const user = await User.create(userBody);
  return user;
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const restaurants = await Restaurant.find({
    ownerId: userId,
  });

  for (let i = 0; i < restaurants.length; i++) {
    const res = restaurants[i];
    await Review.deleteMany({
      restaurantId: res.id,
    });
  }

  await Restaurant.deleteMany({
    ownerId: userId,
  });
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
