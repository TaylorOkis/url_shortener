import request from "supertest";
import app from "../src/app";

import { describe, expect, test } from "@jest/globals";

const body = {
  long_url: "https://localhost:5000/google/way?k=wwe&contains=USASETH",
};

jest.mock("nanoid");

describe("URL Shortener API", () => {
  test("testing generate short url", async () => {
    return request(app)
      .post("/url/shorten")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) =>
        expect(response.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
            short_url: `https://localhost:5000/mockedID`,
          })
        )
      );
  });

  test("GET /url/{short_url_code} --> redirect to the long url", async () => {
    return request(app).get("/url/YmejsfUUdkf3").expect(302);
  });

  test("GET /{invalid_short_url_code} ---> 404 if not found", async () => {
    return request(app).get("/aaabbb").expect(404);
  });
});
