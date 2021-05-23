const express = require("express");

const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const apartmentRoute = require("./apartment.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/apartments",
    route: apartmentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
