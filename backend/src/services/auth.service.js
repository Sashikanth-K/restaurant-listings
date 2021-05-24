const httpStatus = require("http-status");
const userService = require("./user.service");
const tokenService = require("./token.service");
const { Token, User } = require("../models");
const ApiError = require("../utils/ApiError");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const logout = async (refreshToken) => {};

const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  verifyEmail,
};
