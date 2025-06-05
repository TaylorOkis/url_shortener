## Project Overview (URL Shortner Service)

This repository implements a full-featured URL shortening service built with **Node.js**, **TypeScript**, and **Express**, utilizing **Prisma** for database interactions (with PostgreSQL) and **Redis** for in-memory caching. The service not only generates short URLs for long links, but also captures click analytics (IP address, geographic information, browser/OS/device data, referrer, timestamp) on every redirect. It provides rate limiting for security, input validation, structured error handling, and a comprehensive testing suite with **Jest** and load-testing with **Artillery**. Containerization is supported via a multi-stage **Dockerfile**, enabling production-ready deployments.

The architecture adheres to a modular, layered structure, separating concerns into controllers, routes, database configuration, middleware, utilities, and type definitions. The database schema undergoes multiple migrations to evolve from a simple `Url` table into a richer data model with `User`, `ShortenedURL`, and `ClickEvent` tables, capturing relationships and indices optimized for lookup and analytics.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup & Migrations](#database-setup--migrations)
  - [Running the Application](#running-the-application)

- [Architecture & Code Structure](#architecture--code-structure)

  - [Entry Points](#entry-points)
  - [Controllers](#controllers)
  - [Routing](#routing)
  - [Middleware](#middleware)
  - [Database Configuration](#database-configuration)
  - [Prisma Schema and Migrations](#prisma-schema-and-migrations)
  - [Utilities](#utilities)
  - [Type Definitions](#type-definitions)
  - [Testing](#testing)

- [API Endpoints](#api-endpoints)

  - [`POST /url/shorten`](#post-urlshorten)
  - [`GET /url/:short_code`](#get-urlshort_code)

- [Database Models (Prisma)](#database-models-prisma)

  - [User](#user)
  - [ShortenedURL](#shortenedurl)
  - [ClickEvent](#clickevent)

- [Caching & Performance](#caching--performance)
- [Error Handling](#error-handling)
- [Logging & Analytics](#logging--analytics)
- [Security & Rate Limiting](#security--rate-limiting)
- [Docker Setup](#docker-setup)
- [Load Testing (Artillery)](#load-testing-artillery)
- [License](#license)

---

## Features

- **Shorten Long URLs**: Generate unique short codes for arbitrary long URLs.
- **Redirect & Analytics**: On accessing a short URL, users are redirected to the original long URL, and click analytics (IP address, location, browser/OS/device, referrer, timestamp) are recorded.
- **Database Persistence**: All URL mappings and click events persist in PostgreSQL, managed via Prisma ORM.
- **Redis Caching**: In-memory caching of URL lookups for high-performance redirects, with Redis guaranteeing low-latency reads and write-through caching on cache misses.
- **Rate Limiting**: Protects endpoints from abuse by limiting requests (configurable to 1000 requests per 15 minutes).
- **Validation & Sanitization**: Input validation using `express-validator` to ensure well-formed requests.
- **Structured Error Handling**: Custom error classes for standardized API error responses (400, 401, 404, 422, 500, etc.).
- **IP & User-Agent Capture**: Middleware extracts client IP, and utilities parse geolocation (via `node-ipinfo`) and user-agent strings.
- **Testing Suite**: Unit/integration tests with `Jest`, including mocked dependencies for isolated testing.
- **Load Testing**: `Artillery` configuration to simulate load against the redirect endpoint.
- **Containerization**: Multi-stage `Dockerfile` to build and run in production, with separate dev/prod configuration files.
- **Environment Configuration**: `.env` and `.env.prod` examples provided for local and production variables.
- **TypeScript**: Strict type safety across the codebase, with module path aliases via `tsconfig.json`.

---

## Tech Stack

- **Runtime & Language**: Node.js 18+ with TypeScript
- **Web Framework**: Express.js
- **ORM & Database**: Prisma ORM with PostgreSQL
- **Caching**: Redis
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Logging**: `morgan` (HTTP request logging), plus Winston could be added if extended
- **IP/Geolocation**: node-ipinfo
- **User-Agent Parsing**: ua-parser-js
- **Testing**: Jest (`ts-jest` preset)
- **Load Testing**: Artillery
- **Containerization**: Docker (multi-stage builds)
- **Environment Management**: dotenv
- **Build Tool**: tsc (with `tsc-alias` for path mapping)
- **Linting & Formatting**: (Not included, but easily added, e.g., ESLint/Prettier)

---

## Getting Started

### Prerequisites

- **Node.js** (≥ v18) and **npm** installed.
- **Docker** & **Docker Compose** (if you plan to run containerized).
- **PostgreSQL** instance (locally or hosted).
- **Redis** instance (locally or hosted).
- **Powershell/Git Bash**/**Bash** on Windows/**Terminal** on macOS/Linux.

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd url_shortener/url_shortener
   ```

2. **Install Dependencies**

   ```bash
   npm ci
   ```

3. **Set Up Environment Variables**

   Copy the example `.env` file and adjust values as needed:

   ```ini
   # .env
   DATABASE_URL="postgresql://postgres:rootDB2001%23@localhost:5432/URL_shortener?schema=public"

   # TODO: Change host to 0.0.0.0 on the server
   REDIS_URL="redis://192.168.0.103:6379"
   ```

   For production, use `.env.prod`:

   ```ini
   # .env.prod
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=supersecretpass
   POSTGRES_DB=urlDB
   DATABASE_URL="postgresql://myuser:supersecretpass@db:5432/urlDB?schema=public"
   PORT=5000
   NODE_ENV=production
   REDIS_URL="redis://192.168.0.103:6379"
   ```

   > **Note:** The `.gitignore` is configured to ignore both `.env` and `.env.prod`, so sensitive credentials will not be committed.

### Configuration

#### `.gitignore`

```gitignore
node_modules
.env
artillery.yml
.dockerignore
.env.prod
```

#### `.dockerignore`

```dockerignore
node_modules
.env
artillery.yml
jest.config.ts
.gitignore
tests
.git
Dockerfile
.dockerignore
```

#### `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ES2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noImplicitAny": true,
    "removeComments": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### `jest.config.ts`

```ts
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
```

#### `artillery.yml`

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Get long url using short url"
    flow:
      - get:
          url: "/url/f7iOCwIXv"
```

### Database Setup & Migrations

1. **Prisma Initialization**

   Ensure `DATABASE_URL` is set in your environment (pointing to a PostgreSQL database). Then install Prisma Client:

   ```bash
   npx prisma generate
   ```

2. **Run Migrations**

   The project includes a set of migration files under `prisma/migrations/`. To apply them in sequence:

   ```bash
   npx prisma migrate deploy
   ```

   This will create the following tables (in order):

   - **Migration 20250404225002_init**:

     - Creates `Url` table (initial schema)
     - Unique indices on `longUrl` and `shortUrl`.

   - **Migration 20250409192319_clicks**:

     - Adds a `clicks` integer column (default 0) to the `Url` table.

   - **Migration 20250410110400_schema_remodel**:

     - Drops the original `Url` table.
     - Creates new enums (`Browser`, `OS`, `DeviceType`).
     - Creates `User`, `ShortenedURL`, and `ClickEvent` tables, along with indices and foreign keys.

   After migrating, your database will possess the new schema with three primary models: `User`, `ShortenedURL`, and `ClickEvent`.

3. **Verify Database Connection**

   The code automatically connects to the database via `src/database/db.ts`, using a singleton `PrismaClient` instance. On non-production environments, Prisma Client is stored in a global variable to prevent multiple instances during hot reloads.

### Running the Application

#### In Development Mode

```bash
npm run dev
```

- Uses `tsnd` (TypeScript Node Dev) to watch source files, restart on changes, and transpile on the fly.
- The application will listen on `PORT` (defaults to `5000` if not set) and expose endpoints under `/url`.

#### Building for Production

```bash
npm run build
npm run start
```

- `npm run build` compiles TypeScript to JavaScript, places output in `dist/`, and runs `tsc-alias` to rewrite path aliases.
- `npm run start` launches the compiled code in `dist/index.js`.

#### Docker

A multi-stage `Dockerfile` is provided for containerized builds. In production stage, only necessary artifacts (compiled code, Prisma client, production dependencies) are included.

##### `Dockerfile`

```dockerfile
# ----- Stage 1: Build ------ #
FROM  node:alpine AS builder
WORKDIR /apps/url-redis-app
# install all dependencies #
COPY package*.json ./
RUN npm ci
# Copy source + Prisma schema #
COPY . .
# build TS and generate Prisma Client #
RUN npm run build
RUN npm run postinstall

# ----- Stage 2: Production Image ------#
FROM node:alpine AS Production
WORKDIR /app
# only copy package files and innstall prod dependencies #
COPY package.json ./
RUN npm ci --omit-dev
# Copy compiled code, Prisma client, and schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma
# expose port and define start command
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run with:

```bash
# Build
docker build -t url-shortener-app .

# Run (ensure .env.prod is used or pass env vars via -e)
docker run -d -p 5000:5000 --env-file .env.prod url-shortener-app
```

---

## Architecture & Code Structure

```
url_shortener/
├── .dockerignore
├── .env
├── .env.prod
├── .gitignore
├── artillery.yml
├── Dockerfile
├── jest.config.ts
├── LICENSE
├── package-lock.json
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── 20250404225002_init/
│       ├── 20250409192319_clicks/
│       └── 20250410110400_schema_remodel/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── controllers/
│   │   └── shortener.ts
│   ├── database/
│   │   ├── db.ts
│   │   └── redisDB.ts
│   ├── middlewares/
│   │   ├── error-handler.ts
│   │   ├── logIP.ts
│   │   ├── not-found.ts
│   │   └── validation.ts
│   ├── routes/
│   │   └── shortener.ts
│   ├── types/
│   │   └── types.ts
│   └── utils/
│       ├── constants/
│       │   └── characters.ts
│       ├── error/
│       │   ├── bad-request.ts
│       │   ├── custom-error.ts
│       │   ├── index.ts
│       │   ├── not-found.ts
│       │   ├── unauthenticated.ts
│       │   ├── unauthorized.ts
│       │   └── unprocessable-entity.ts
│       ├── IP/
│       │   ├── getIp.ts
│       │   ├── getIpInfo.ts
│       │   ├── localIP.ts
│       │   └── user-agent-data.ts
│       ├── redis/
│       │   └── check-connection.ts
│       └── validator/
│           └── validators.ts
└── tests/
    ├── app.test.ts
    └── __mocks__/
        └── nanoid.ts
```

### Entry Points

- **`src/index.ts`**

  - Loads environment variables via `dotenv`.
  - Imports the Express `app` from `app.ts` and begins listening on the specified `PORT` (default `5000`).

- **`src/app.ts`**

  - Configures global middleware:

    - `express.json()` for JSON body parsing.
    - `cors()` to allow Cross-Origin Resource Sharing (CORS).
    - `express-rate-limit` with a 15-minute window and a limit of 1000 requests per IP.
    - **(Note:** Although `helmet` is listed in dependencies, it is not invoked directly in the middleware chain—consider adding `helmet()` for additional security headers.)

  - Mounts the `/url` router from `src/routes/shortener.ts`.
  - Attaches `notFound` middleware for any unmatched routes.
  - Attaches `errorHandler` middleware for centralized error formatting.

### Controllers

- **`src/controllers/shortener.ts`**

  - **`generateShortURL(req, res)`**

    - Validates that `req.body.long_url` is provided (middleware enforced).
    - Decodes and normalizes the `longUrl`.
    - Uses `Prisma` to check if a record with that `longUrl` already exists:

      - If it exists, returns the existing short code (and increments the click counter? In some implementations one may increment on each access, but this flow returns the existing mapping).
      - Otherwise:

        - Generates a unique `shortCode` via `nanoid`, using a custom alphabet defined in `src/utils/constants/characters.ts`.
        - Persists a new `ShortenedURL` record, storing `id`, `shortCode`, `longUrl`, (optional) `expiresAt`, and default `clickCount = 0`.

      - Returns a JSON response with `{ status: "success", data: { short_url: "<generated_code>" } }`.

  - **`getOriginalURL(req, res)`**

    - Validates that `req.params.short_code` exists (middleware enforced).
    - Middleware `logIP` populates `req.client.clientIp`.
    - Attempts to fetch the original URL and metadata from **Redis** cache by `shortCode`:

      - If found in cache, returns immediately without hitting the database.
      - If not found, queries `Prisma` for a `ShortenedURL` by the given `shortCode`:

        - If the record does not exist or is not enabled, throws a `NotFoundError`.
        - Otherwise:

          - Retrieves associated click analytics info if desired.
          - Increments the `clickCount` in the `ShortenedURL` record via a Prisma transaction.
          - Populates Redis cache with the `shortCode → longUrl` mapping for subsequent quick lookups.

    - Extracts IP, user-agent, geolocation, and other request info:

      - **`getIpInfo`** calls external IP geolocation service (via `node-ipinfo`), returning `country`, `city`, etc.
      - **`getUserAgentData`** analyzes the `User-Agent` header via `ua-parser-js`, extracting `browser`, `os`, `deviceType`.
      - **`localIP.ts`** determines if the IP is “local” (e.g., `127.0.0.1`) and can skip geolocation lookups if local.

    - Stores a new `ClickEvent` record with the above data, associated via `shortUrlId`.
    - Responds with `{ status: "success", message: "<decoded_long_url>" }`.
      _(Optionally, one could respond with a 302 redirect: `res.redirect(longUrl)`, but in this implementation the JSON payload is returned. You may adjust to use `res.redirect(longUrl)` if desired.)_

### Routing

- **`src/routes/shortener.ts`**

  - Defines two routes under the `/url` prefix:

    1. **`GET /url/:short_code`**

       - **Validators**: Checks `short_code` exists and is sanitized (`escape()`).
       - **`validationMiddleware`**: Throws `UnprocessableEntityError` if validation fails.
       - **`logIPMiddleware`**: Captures IP before controller.
       - **`getOriginalURL`** from controller.

    2. **`POST /url/shorten`**

       - **Validators**: Checks `body.long_url` is not empty and is sanitized.
       - **`validationMiddleware`**: Throws if validation fails.
       - **`generateShortURL`** from controller.

### Middleware

- **`src/middlewares/validation.ts`**

  - Uses `express-validator`’s `validationResult` to check for errors.
  - Throws `UnprocessableEntityError` if any validation errors exist.

- **`src/middlewares/logIP.ts`**

  - Extracts client IP from either `x-forwarded-for` header or `req.socket.remoteAddress`.
  - Attaches `req.client = { clientIp }` for downstream use in controllers.

- **`src/middlewares/not-found.ts`**

  - Any unmatched route calls `next(new NotFoundError("Route not Found"))`.

- **`src/middlewares/error-handler.ts`**

  - Central error handler for `CustomAPIError` subclasses or generic `Error`.
  - Formats response with correct HTTP `statusCode` and error message, or defaults to `500` for unhandled errors.

### Database Configuration

- **`src/database/db.ts`**

  - Initializes a singleton `PrismaClient`.
  - In non-production (`NODE_ENV !== "production"`), it assigns the client to `globalThis.prisma` to avoid multiple client instances across hot reloads.

- **`src/database/redisDB.ts`**

  - Uses the `redis` package to create a `RedisClientType` from `REDIS_URL`.
  - Invokes `checkRedisClientConnection()` (in `src/utils/redis/check-connection.ts`) to `connect()` if not already open.
  - Logs successful connection or throws an error if connection fails.

### Prisma Schema

- **`prisma/schema.prisma`** defines:

  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  enum Browser {
    CHROME
    FIREFOX
    SAFARI
    EDGE
    OPERA
    OTHER
  }

  enum OS {
    WINDOWS
    MACOS
    LINUX
    IOS
    ANDROID
    OTHER
  }

  enum DeviceType {
    MOBILE
    TABLET
    DESKTOP
    OTHER
  }

  model User {
    id              String         @id @default(uuid())
    email           String         @unique
    passwordHash    String
    createdAt       DateTime       @default(now())
    updatedAt       DateTime       @updatedAt
    emailVerified   Boolean        @default(false)

    ShortenedURL    ShortenedURL[]

    @@index([email, createdAt])
  }

  model ShortenedURL {
    id          String         @id @default(uuid())
    shortCode   String         @unique
    longUrl     String
    expiresAt   DateTime?
    enabled     Boolean        @default(true)
    clickCount  Int            @default(0)
    createdAt   DateTime       @default(now())
    updatedAt   DateTime       @updatedAt

    userId      String?
    user        User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
    ClickEvent  ClickEvent[]

    @@index([shortCode])
    @@index([userId])
    @@index([createdAt])
    @@index([expiresAt])
    @@index([clickCount])
  }

  model ClickEvent {
    id          String       @id @default(uuid())
    timeStamp   DateTime     @default(now())
    referrer    String?
    country     String?
    city        String?
    browser     Browser?
    os          OS?
    deviceType  DeviceType?
    ipAddress   String?

    shortUrlId  String
    shortUrl    ShortenedURL @relation(fields: [shortUrlId], references: [id])

    @@index([shortUrlId])
    @@index([timeStamp])
    @@index([country])
    @@index([browser])
    @@index([os])
    @@index([deviceType])
    @@index([shortUrlId, timeStamp])
  }
  ```

### Utilities

- **`src/utils/constants/characters.ts`**

  - Defines the custom alphabet for `nanoid` to generate short codes:

    ```
    const characters =
      "0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    export default characters;
    ```

- **`src/utils/error/`**

  - A suite of custom error classes inheriting from `CustomAPIError` (which extends the base `Error` class):

    - `BadRequestError` → HTTP 400
    - `NotFoundError` → HTTP 404
    - `UnauthenticatedError` → HTTP 401
    - `UnauthorizedError` → HTTP 403
    - `UnprocessableEntityError` → HTTP 422 (captures validation errors)
    - `CustomAPIError` → Base class carrying `statusCode` and message.

- **`src/utils/IP/`**

  - `getIp.ts` → Extracts client IP from `x-forwarded-for` or `req.socket.remoteAddress`.
  - `localIP.ts` → Returns a boolean indicating if the IP address is local/private (skips geolocation lookups if so).
  - `getIpInfo.ts` → Contacts `node-ipinfo` to retrieve geolocation (country, city, etc.) from an IP.
  - `user-agent-data.ts` → Uses `ua-parser-js` to normalize `User-Agent` header into `browser`, `os`, and `deviceType` enums.

- **`src/utils/redis/check-connection.ts`**

  - Checks if the `redisClient.isOpen` is `false`; if so, calls `redisClient.connect()` to establish a connection.

- **`src/utils/validator/validators.ts`**

  - Defines `express-validator` middleware arrays:

    - `generateURLValidator`: Ensures `body.long_url` is not empty and is properly escaped.
    - `getOriginalURLValidator`: Ensures `param.short_code` exists and is escaped.

### Type Definitions

- **`src/types/types.ts`**

  ```ts
  import { Request } from "express";

  interface CustomRequest extends Request {
    client?: {
      clientIp: string | null;
    };
  }

  export default CustomRequest;
  ```

  This extends the Express `Request` type to include a `client` object holding `clientIp`.

### Testing

- **Unit & Integration Tests** in `tests/app.test.ts`:

  - Uses `ts-jest` preset for TypeScript tests.
  - Mocks `nanoid` to guarantee deterministic short codes in testing.
  - Validates controller routes, error responses, and database interactions.

- **Mock Directory**

  - `tests/__mocks__/nanoid.ts` → Supplies a static `customAlphabet` that returns predictable short codes for tests.

---

## API Endpoints

### `POST /url/shorten`

- **Description**
  Submits a JSON payload containing a `long_url` field. Generates (or reuses) a short code and persists the mapping.

- **Request**

  ```http
  POST /url/shorten
  Content-Type: application/json

  {
    "long_url": "https://www.example.com/some/very/long/path?with=params"
  }
  ```

- **Validation**

  - `long_url` must be provided, non-empty, and free of malicious characters (sanitized via `escape()`).

- **Behavior**

  1. Decode the incoming `long_url`.
  2. Query PostgreSQL to see if `longUrl` already has a `ShortenedURL` record:

     - If it exists, return that existing short code.
     - Otherwise, generate a new `shortCode` using `nanoid(characters, 7)` (7 characters long).

  3. Store a new `ShortenedURL` row with fields:

     - `id: UUID` (auto-generated by Prisma),
     - `shortCode: string` (unique),
     - `longUrl: string` (decoded),
     - `expiresAt: DateTime?` (optional—if business logic extends to allow expirable links),
     - `enabled: boolean` (defaults to `true`),
     - `clickCount: 0` initially.

  4. Return a JSON response:

     ```json
     {
       "status": "success",
       "data": {
         "short_url": "<generated_code>"
       }
     }
     ```

  5. If validation fails, a `422 Unprocessable Entity` is returned with structured error details.

- **Success Response**

  ```http
  HTTP/1.1 201 Created
  Content-Type: application/json

  {
    "status": "success",
    "data": {
      "short_url": "Ab1Cd2E"
    }
  }
  ```

- **Error Responses**

  - `400 Bad Request`: If request body is malformed.
  - `422 Unprocessable Entity`: If `long_url` is missing or invalid.
  - `500 Internal Server Error`: On unexpected failures.

### `GET /url/:short_code`

- **Description**
  Retrieves the original long URL corresponding to a given `short_code`. Also records a click event (including IP, geolocation, user-agent data) and increments click counters. Optionally, the controller logic could use `res.redirect(longUrl)` to perform a 302 redirect instead of returning JSON.

- **Request**

  ```http
  GET /url/Ab1Cd2E
  ```

- **Validation**

  - Must include `short_code` as a URL parameter (sanitized via `escape()`).

- **Behavior**

  1. Extract `req.params.short_code`.
  2. Check Redis cache for an existing `shortCode → longUrl` mapping:

     - If found, skip database lookup.
     - If not found:

       - Query Prisma for a `ShortenedURL` where `shortCode = :short_code` and `enabled = true`.
       - If no record exists or it’s disabled, throw `NotFoundError`.
       - Otherwise:

         - Store `shortCode → longUrl` in Redis (e.g., via `redisClient.set(shortCode, longUrl)`).
         - Increment `clickCount` atomically in the database via a Prisma transaction.

  3. Via `req.client.clientIp` (set in `logIPMiddleware`), determine if it’s a private/local IP:

     - If not local, call `getIpInfo(ip)` to fetch geolocation (`country`, `city`, etc.).

  4. Parse the `User-Agent` header via `getUserAgentData()`, returning enumerated `browser`, `os`, and `deviceType`.
  5. Create a new `ClickEvent` record in PostgreSQL with:

     - `timeStamp: now()`
     - `referrer` (from `req.get("referrer")` or `req.headers["referrer"]`)
     - `country`, `city`: from geolocation (if available)
     - `browser`, `os`, `deviceType`, and `ipAddress`
     - Foreign key `shortUrlId` referencing the `ShortenedURL` record.

  6. Return a JSON response:

     ```json
     {
       "status": "success",
       "message": "<decoded_long_url>"
     }
     ```

     Alternatively, to perform a redirect, replace with:

     ```ts
     res.redirect(longUrl);
     ```

- **Success Response**

  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "status": "success",
    "message": "https://www.example.com/some/very/long/path?with=params"
  }
  ```

- **Error Responses**

  - `404 Not Found`: If `short_code` does not exist or is disabled.
  - `422 Unprocessable Entity`: If validation fails.
  - `500 Internal Server Error`: On unexpected failures.

---

## Database Models (Prisma)

Below is a conceptual overview (with emphasis on fields, relationships, and indices) of the current schema after all migrations have been applied:

### User

- **Purpose**: Represents a user account (potential extension for authenticated link-management).
- **Fields**:

  - `id: String (UUID) @id @default(uuid())`
  - `email: String @unique`
  - `passwordHash: String`
  - `createdAt: DateTime @default(now())`
  - `updatedAt: DateTime @updatedAt`
  - `emailVerified: Boolean @default(false)`

- **Relations**:

  - `ShortenedURL[]` → One user can have many shortened URLs.

- **Indices**:

  - Unique index on `email`.
  - Composite index on `[email, createdAt]` for fast lookups.

### ShortenedURL

- **Purpose**: Main table mapping a generated `shortCode` to a `longUrl`.
- **Fields**:

  - `id: String (UUID) @id @default(uuid())`
  - `shortCode: String @unique` (e.g., `Ab1Cd2E`)
  - `longUrl: String` (decoded version of the original URL)
  - `expiresAt: DateTime?` (optional—if you want expirable links)
  - `enabled: Boolean @default(true)` (to allow disabling a short link)
  - `clickCount: Int @default(0)` (tracks total redirects)
  - `createdAt: DateTime @default(now())`
  - `updatedAt: DateTime @updatedAt`

- **Relations**:

  - `userId: String?` → Optional foreign key to a `User`; on deletion of user, set to `null`.
  - `ClickEvent[]` → One short URL can have many associated click events (analytics).

- **Indices**:

  - Unique index on `shortCode`.
  - Index on `userId` (for querying by user).
  - Indices on `createdAt`, `expiresAt`, `clickCount` (for sorting/filtering).

### ClickEvent

- **Purpose**: Records each click/redirect event for analytics.
- **Fields**:

  - `id: String (UUID) @id @default(uuid())`
  - `timeStamp: DateTime @default(now())`
  - `referrer: String?`
  - `country: String?`
  - `city: String?`
  - `browser: Browser?` (enum)
  - `os: OS?` (enum)
  - `deviceType: DeviceType?` (enum)
  - `ipAddress: String?`
  - `shortUrlId: String` → Foreign key to `ShortenedURL.id`

- **Relations**:

  - `shortUrl: ShortenedURL @relation(fields: [shortUrlId], references: [id])`

- **Indices**:

  - Index on `shortUrlId`.
  - Index on `timeStamp` (for date-based queries).
  - Index on `country`, `browser`, `os`, `deviceType` to accelerate analytics queries.
  - Composite index on `[shortUrlId, timeStamp]` for filtering click events of a URL in chronological order.

---

## Caching & Performance

- **Redis Integration**

  - On a `GET /url/:short_code` request:

    1. Attempt `redisClient.get(shortCode)` to see if `longUrl` is cached.
    2. If found, skip Prisma. Respond immediately.
    3. If not found, query the database, store `redisClient.set(shortCode, longUrl)` (with optional TTL), and proceed.

  - This drastically reduces database load for repeated URL lookups.

- **Express Rate Limiting**

  - Configured in `app.ts` via `express-rate-limit`:

    ```ts
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 1000, // max requests per IP per windowMs
    });
    app.use(limiter);
    ```

  - Prevents brute-force attacks and request floods.

- **Indices & Query Optimization**

  - Prisma schema defines indices on frequently queried columns (e.g., `shortCode`, `clickCount`, `createdAt`), enabling PostgreSQL to serve large volumes of data efficiently.

---

## Error Handling

The codebase employs custom error classes under `src/utils/error/`:

- **`CustomAPIError`**: Base class carrying a `statusCode` property.
- **`BadRequestError` (400)**
- **`NotFoundError` (404)**
- **`UnauthenticatedError` (401)**
- **`UnauthorizedError` (403)**
- **`UnprocessableEntityError` (422)**

**`error-handler.ts`** middleware detects instances of `CustomAPIError` or generic `Error`, and responds with:

```json
{
  "status": "error",
  "message": "<error.message>"
}
```

…where `<error.message>` is either the custom message (for `CustomAPIError`) or a generic “Internal Server Error” for unexpected exceptions.

---

## Logging & Analytics

- **`logIPMiddleware`**

  - Extracts IP address and sets `req.client.clientIp`.
  - Subsequently used in `getOriginalURL` to:

    - Determine if IP is local (`localIP.ts`).
    - If not local, call `getIpInfo()` to resolve geolocation.
    - Parse `User-Agent` header via `ua-parser-js` (`user-agent-data.ts`).
    - Insert a `ClickEvent` record with detailed analytics:

      - `ipAddress`, `browser`, `os`, `deviceType`, `country`, `city`, `referrer`, `timeStamp`.

- **Database-Backed Analytics**

  - Over time, the `ClickEvent` table builds a rich dataset for:

    - **Geographic Distribution**: Number of clicks by `country`/`city`.
    - **Device & Browser Breakdown**: Count by `browser`, `os`, `deviceType`.
    - **Referrers & Trends**: Track which sites are driving traffic.
    - **Temporal Analysis**: Use indices on `timeStamp` to plot usage over time.

---

## Security & Rate Limiting

- **Rate Limiting** (as shown in `app.ts`): Limits clients to **1000 requests per 15 minutes**.
- **Input Sanitization**: All user-provided fields are sanitized with `escape()` in `express-validator`.
- **Helmet** (dependency included): Although not invoked in the code, it is recommended to insert `app.use(helmet())` in `app.ts` to set security headers (XSS, HSTS, etc.).
- **Environment Variables**:

  - Sensitive credentials (`DATABASE_URL`, `REDIS_URL`, etc.) are stored in `.env` or `.env.prod`.
  - `.gitignore` ensures they are not committed.

---

## Docker Setup

The multi-stage `Dockerfile` compiles TypeScript and Prisma client in a `builder` stage, then copies only necessary artifacts into a lean production image.

1. **Build Stage**

   - Uses `node:alpine` as a base.
   - Runs `npm ci` to install all dependencies (including dev).
   - Copies the entire source into `/apps/url-redis-app`.
   - Runs `npm run build` (`tsc && tsc-alias`) and `npm run postinstall` (`prisma generate`).

2. **Production Stage**

   - Uses a fresh `node:alpine` base.
   - Copies only `package.json` and runs `npm ci --omit-dev`, installing only production dependencies.
   - Copies the compiled `/dist` folder, `node_modules/.prisma`, `node_modules/@prisma`, and the `prisma/` folder from the builder stage.
   - Exposes port `5000`, and sets `CMD ["npm", "start"]`.

Build and run steps:

```bash
# Build the Docker image (tag: url-shortener-app)
docker build -t url-shortener-app .

# Run, loading environment from .env.prod
docker run -d -p 5000:5000 --env-file .env.prod url-shortener-app
```

- **`.dockerignore`** ensures build artifacts and sensitive files are not included in the Docker context.

---

## Load Testing (Artillery)

The `artillery.yml` file configures a simple load test:

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Get long url using short url"
    flow:
      - get:
          url: "/url/f7iOCwIXv"
```

- **Purpose**: Simulate 10 requests per second against the `/url/:short_code` endpoint for 60 seconds.
- **Usage**:

  ```bash
  npx artillery run artillery.yml
  ```

This helps validate:

- Response timings under sustained load.
- Redis cache effectiveness (cache hits vs. misses).
- Database connection stability.

---

## Use-Case Example

1. **Shortening a URL**

   - Client issues `POST /url/shorten` with:

     ```json
     {
       "long_url": "https://www.example.com/blog/2025/06/fast-url-shortening-service"
     }
     ```

   - Server checks if the long URL already exists. If not, generates a `shortCode` like `Ab1Cd2E`.
   - Persists in PostgreSQL (`ShortenedURL`), with `clickCount = 0`.
   - Returns:

     ```json
     {
       "status": "success",
       "data": {
         "short_url": "Ab1Cd2E"
       }
     }
     ```

2. **Redirecting / Tracking Clicks**

   - A user clicks on `https://example.net/Ab1Cd2E` (this forwards to your server internally as `GET /url/Ab1Cd2E`).
   - **Redis Check**: If no cache entry, the service queries PostgreSQL for the `ShortenedURL`.
   - **Increment Counter**: `clickCount += 1` in the `ShortenedURL` row.
   - **Cache**: Sets `Redis.set("Ab1Cd2E", "https://www.example.com/blog/2025/06/fast-url-shortening-service")`.
   - **Analytics**:

     - Extracts the client IP (e.g., `203.0.113.45`).
     - Looks up geolocation (e.g., `United States`, `New York`).
     - Parses `User-Agent` into `browser = CHROME`, `os = WINDOWS`, `deviceType = DESKTOP`.
     - Creates a `ClickEvent` that references `ShortenedURL.id` and stores all these details.

   - Returns:

     ```json
     {
       "status": "success",
       "message": "https://www.example.com/blog/2025/06/fast-url-shortening-service"
     }
     ```

     Or, if refactoring to a redirect, invoke:

     ```ts
     res.redirect(
       "https://www.example.com/blog/2025/06/fast-url-shortening-service"
     );
     ```

3. **Analytics Dashboard (Future Extension)**

   - Query `ClickEvent` by `shortUrlId` to display:

     - Total clicks (`SHORTENEDURL.clickCount`).
     - Clicks by country/city.
     - Clicks per browser/OS/device.
     - Time-series data for traffic over days/weeks.

   - Use indices on `[shortUrlId, timeStamp]` to quickly generate hourly or daily reports.

---

## Testing

- **Unit & Integration Tests**

  - Run via:

    ```bash
    npm run test
    ```

  - **`tests/app.test.ts`** covers:

    - POST `/url/shorten` success and validation failures.
    - GET `/url/:short_code` for:

      - Non-existent codes (`404`).
      - Successful redirects with cache misses/hits.
      - Analytics insertion into `ClickEvent`.

    - Mocks `nanoid` to ensure consistent, reproducible short codes.

- **Mocking**

  - In `tests/__mocks__/nanoid.ts`, the `customAlphabet` function is replaced with a stub that always returns a fixed string (e.g., `TEST123`), ensuring deterministic behavior.

---

## License

This project is released under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

_By following this documentation, one can understand the full architecture, configuration, and usage of the URL Shortener repository. The code is structured for clarity and extensibility, enabling easy addition of features such as user authentication, link expiration policies, and a web dashboard for analytics._
