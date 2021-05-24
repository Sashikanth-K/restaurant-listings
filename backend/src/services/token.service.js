const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const { Token } = require("../models");

const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(user.id, expires);
  await saveToken(verifyEmailToken, user.id, expires);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateVerifyEmailToken,
};
