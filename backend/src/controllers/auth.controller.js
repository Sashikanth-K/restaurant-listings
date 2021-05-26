const httpStatus = require("http-status");
const logger = require("../config/logger");

const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");

const register = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    res.status(httpStatus.CREATED).send({
      code: httpStatus.CREATED,
      message:
        "Account has been registered and an verification mail has been sent. Please confirm the mail inorder to login.",
    });
  } catch (error) {
    logger.error(error);
    //console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  res.send(req.user);
};

const logout = async (req, res, next) => {
  try {
    req.logout();
    //await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  try {
    const user = await userService.getUserByEmail(req.query.email);
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    res.status(200).send({
      code: 200,
      message: "Email verification code sent to " + req.query.email,
    });
  } catch (error) {
    logger.error(error);
    next(error.message);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.OK).send({
      code: 200,
      message: "Email Verified. Now you can login into your account.",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  sendVerificationEmail,
  verifyEmail,
};
