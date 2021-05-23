const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (!req.user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    }

    if (requiredRights.length) {
      const userRights = roleRights.get(req.user.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    resolve();
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
