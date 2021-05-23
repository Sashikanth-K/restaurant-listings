const roles = ["user", "realtor", "admin"];

const roleRights = new Map();
roleRights.set(roles[0], ["getApartments", "getApartment"]);
roleRights.set(roles[1], [
  "createApartment",
  "getApartments",
  "getApartment",
  "updateApartment",
  "deleteApartment",
]);
roleRights.set(roles[2], [
  "getUsers",
  "createUsers",
  "getUser",
  "getUsers",
  "updateUser",
  "deleteUser",
  "getApartments",
  "getApartment",
  "updateApartment",
  "deleteApartment",
]);

module.exports = {
  roles,
  roleRights,
};
