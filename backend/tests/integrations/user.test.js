const request = require("supertest");
// var session = require("supertest-session");
const faker = require("faker");
const httpStatus = require("http-status");
const app = require("../../src/app");
const setupTestDB = require("../utils/setupTestDB");
const { User } = require("../../src/models");
const {
  userOne,
  userTwo,
  admin,
  insertUsers,
} = require("../fixtures/user.fixture");

setupTestDB();

describe("User routes", () => {
  describe("POST /users", () => {
    let newUser;
    let Cookies;

    beforeEach(async () => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: "password1",
        role: "user",
      };
      await insertUsers([admin, userOne]);
    });

    test("Login", async () => {
      const res = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send({ email: admin.email, password: admin.password })
        .expect(200);
      Cookies = res.headers["set-cookie"].pop().split(";")[0];
    });

    test("should return 201 and successfully create new user if data is ok", async () => {
      let req = request(app).post("/users");
      req.cookies = Cookies;
      const res = await req.send(newUser).expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty("password");
      expect(res.body).toMatchObject({
        id: expect.anything(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
      });

      const dbUser = await User.findById(res.body.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: false,
      });
    });

    test("should be able to create an admin as well", async () => {
      newUser.role = "admin";
      let req = request(app).post("/users");
      req.cookies = Cookies;

      const res = await req.send(newUser).expect(httpStatus.CREATED);

      expect(res.body.role).toBe("admin");

      const dbUser = await User.findById(res.body.id);
      expect(dbUser.role).toBe("admin");
    });

    // test("should return 400 error if email is already used", async () => {
    //   newUser.email = userOne.email;
    //   let req = request(app).post("/users");
    //   req.cookies = Cookies;

    //   await req.send(newUser).expect(httpStatus.INTERNAL_SERVER_ERROR);
    // });
  });

  describe("GET /users", () => {
    let Cookies;

    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
    });

    test("Login", async () => {
      const res = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send({ email: admin.email, password: admin.password })
        .expect(200);
      Cookies = res.headers["set-cookie"].pop().split(";")[0];
    });
    test("should return 200 and apply the default query options", async () => {
      let req = request(app).get("/users");
      req.cookies = Cookies;

      const res = await req.send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 3,
      });
      expect(res.body.results).toHaveLength(3);
      expect(res.body.results[0]).toMatchObject({
        id: userOne._id.toHexString(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
      });
    });
  });

  describe("DELETE /users/:userId", () => {
    let Cookies;

    beforeEach(async () => {
      await insertUsers([userOne, admin, userTwo]);
    });

    test("Login", async () => {
      const res = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send({ email: admin.email, password: admin.password })
        .expect(200);
      Cookies = res.headers["set-cookie"].pop().split(";")[0];
    });
    test("should return 204 if data is ok", async () => {
      let req = request(app).delete(`/users/${userOne._id}`);
      req.cookies = Cookies;

      await req.send().expect(httpStatus.NO_CONTENT);

      const dbUser = await User.findById(userOne._id);
      expect(dbUser).toBeNull();
    });
  });

  //
});
