const httpStatus = require("http-status");

const { authService, userService } = require("../services");

const register = async (req, res) => {
  res.status(httpStatus.CREATED).send(req.user);
};

const login = async (req, res) => {
  res.send(req.user);
};

const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  register,
  login,
  logout,
};
