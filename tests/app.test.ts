import request from "supertest";
import app from "../src/app";

import { describe, expect, test } from "@jest/globals";

describe("URL Shortener API", () => {
  test("POST /url/shorten --> short form of url", async () => {
    return request(app)
      .post("/url/shorten")
      .expect("Content-Type", /json/)
      .expect(201)
      .then((response) =>
        expect(response.body).toEqual(
          expect.objectContaining({ short_url: expect.any(String) })
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
