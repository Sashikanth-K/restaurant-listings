const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const httpStatus = require("http-status");

const { userService } = require("../services");
const ApiError = require("../utils/ApiError");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (u, done) {
  const user = await userService.getUserByEmail(u.email);
  done(null, user);
});

const optionsLogin = {
  usernameField: "email",
  passwordField: "password",
};

const verifyLogin = async (email, password, done) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const optionsRegister = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

const verifyRegister = async (req, email, password, done) => {
  try {
    const user = await userService.createUser(req.body);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

const localLoginStrategy = new LocalStrategy(optionsLogin, verifyLogin);
const localRegisterStrategy = new LocalStrategy(
  optionsRegister,
  verifyRegister
);

module.exports = {
  localLoginStrategy,
  localRegisterStrategy,
};
