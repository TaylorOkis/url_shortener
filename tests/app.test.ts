import request from "supertest";
import app from "../src/app";

import { describe, expect, test } from "@jest/globals";

const body = {
  long_url:
    "https://www.hellointerview.com/learn/system-design/problem-breakdowns/bitly",
};

jest.mock("nanoid");

describe("URL Shortener API", () => {
  test.skip("testing generate short url", async () => {
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
            short_url: expect.any(String),
          })
        )
      );
  });

  test("testing getting long url and redirecting", async () => {
    return request(app).get("/url/1CtismLql").expect(302);
  });

  test("testing requesting for invalid short url", async () => {
    return request(app).get("/url/NxH-IY1SQ").expect(404);
  });
});
