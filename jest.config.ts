import type { Config } from "jest";

const config: Config = {
  displayName: "Testing url-shortener app functions",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
