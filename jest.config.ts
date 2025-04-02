import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const config: Config = {
  displayName: "ts-jest",
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!nanoid)", // Transform nanoid specifically
  ],
  extensionsToTreatAsEsm: [".js"],
};

export default config;
