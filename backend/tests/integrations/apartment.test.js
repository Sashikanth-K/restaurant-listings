const request = require("supertest");
// var session = require("supertest-session");
const faker = require("faker");
const httpStatus = require("http-status");
const app = require("../../src/app");
const setupTestDB = require("../utils/setupTestDB");
const { User, Apartment } = require("../../src/models");
const {
  userOne,
  userTwo,
  admin,
  realtorOne,
  realtorTwo,
  insertUsers,
} = require("../fixtures/user.fixture");

const {
  apartmentOne,
  apartmentTwo,
  insertApartments,
} = require("../fixtures/apartment.fixture");

setupTestDB();

describe("Apartment routes", () => {
  describe("POST /apartments", () => {
    let newApartment;
    let Cookies;

    beforeEach(async () => {
      newApartment = {
        name: faker.name.findName(),
        floorArea: faker.datatype.number(),
        price: faker.datatype.number(),
        numberOfRooms: faker.datatype.number(),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        description: faker.lorem.paragraph(),
      };
      await insertUsers([admin, userOne, realtorOne, realtorTwo]);
    });

    test("Login", async () => {
      const res = await request(app)
        .post("/auth/login")
        .set("Accept", "application/json")
        .send({ email: realtorOne.email, password: realtorOne.password })
        .expect(200);
      Cookies = res.headers["set-cookie"].pop().split(";")[0];
    });

    test("should return 201 and successfully create new apartment if data is ok", async () => {
      let req = request(app).post("/apartments");
      req.cookies = Cookies;
      const res = await req.send(newApartment).expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty("password");
      expect(res.body).toMatchObject({
        id: expect.anything(),
        name: newApartment.name,
      });

      const apartment = await Apartment.findById(res.body.id);
      expect(apartment).toBeDefined();

      expect(apartment).toMatchObject({
        name: newApartment.name,
      });
    });
  });

  describe("GET /apartments", () => {
    let Cookies;

    beforeEach(async () => {
      await insertUsers([admin, userOne, realtorOne, realtorTwo]);
      await insertApartments([apartmentOne, apartmentTwo]);
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
      let req = request(app).get("/apartments");
      req.cookies = Cookies;

      const res = await req.send().expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toMatchObject({
        id: apartmentOne._id.toHexString(),
        name: apartmentOne.name,
      });
    });
  });

  describe("GET /apartments/:apartmentId", () => {
    let Cookies;

    beforeEach(async () => {
      await insertUsers([admin, userOne, realtorOne, realtorTwo]);
      await insertApartments([apartmentOne, apartmentTwo]);
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
      let req = request(app).get(`/apartments/${apartmentOne._id}`);
      req.cookies = Cookies;

      const res = await req.send().expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        name: apartmentOne.name,
        price: apartmentOne.price,
      });
      //
    });
  });

  describe("DELETE /apartments/:apartmentId", () => {
    let Cookies;

    beforeEach(async () => {
      await insertUsers([admin, userOne, realtorOne, realtorTwo]);
      await insertApartments([apartmentOne, apartmentTwo]);
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
      let req = request(app).delete(`/apartments/${apartmentOne._id}`);
      req.cookies = Cookies;

      await req.send().expect(httpStatus.NO_CONTENT);

      const dbUser = await Apartment.findById(apartmentOne._id);
      expect(dbUser).toBeNull();
    });
  });

  //
});
