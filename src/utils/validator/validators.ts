import { body, param } from "express-validator";

const generateURLValidator = [
  body("long_url", "long_url cannot be empty").notEmpty().escape(),
];

const getOriginalURLValidator = [
  param("short_url", "short url has to be included").exists().escape(),
];

export { generateURLValidator, getOriginalURLValidator };
