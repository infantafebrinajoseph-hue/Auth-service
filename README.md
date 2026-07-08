# Auth Service

Production-style authentication API built with Node.js, Express, MongoDB, Redis, JWT, and bcrypt.

## Architecture

Each layer has one job. Requests flow downward; data flows back up.

```
Client
  -> Routes        (URL + HTTP method)
  -> Validators    (input rules)
  -> Controllers   (HTTP request/response)
  -> Services      (business logic)
  -> Repositories  (database access)
  -> Models        (MongoDB schema)
```

Supporting modules:

- `config/` connects MongoDB and Redis
- `utils/jwt.js` signs and verifies access tokens
- `middleware/auth.middleware.js` protects routes

## Why this structure?

| Layer | Responsibility | Why separate? |
|-------|----------------|-------------|
| Routes | Map endpoints to handlers | Keeps routing out of business logic |
| Validators | Check request shape and rules | Fail fast before hitting the DB |
| Controllers | Read `req`, call service, send `res` | HTTP-only layer, easy to test |
| Services | Signup, login, token refresh, logout | Core business rules live here |
| Repositories | `findByEmail`, `create`, `findById` | Swap MongoDB later without touching services |
| Models | Mongoose schema | Single source of truth for user shape |

## Token strategy

This project uses a common production pattern:

1. **Access token (JWT)** — short-lived (15 minutes). Sent on every protected request in the `Authorization` header.
2. **Refresh token (opaque string)** — long-lived (7 days). Stored in **Redis**, not in the database.

```
Signup/Login
  -> create user / verify password
  -> issue access JWT
  -> store refresh token in Redis: refresh:{token} -> userId

Protected route
  -> middleware verifies access JWT

Token refresh
  -> client sends refresh token
  -> server looks it up in Redis
  -> issues new access JWT

Logout
  -> delete refresh token from Redis
```

Redis is used so refresh tokens can be revoked on logout without touching MongoDB.

## Project structure

```
src/
├── config/
│   ├── db.js
│   └── redis.js
├── controllers/
│   └── auth.controller.js
├── services/
│   └── auth.service.js
├── repositories/
│   └── user.repository.js
├── models/
│   └── user.model.js
├── routes/
│   └── auth.routes.js
├── middleware/
│   └── auth.middleware.js
├── utils/
│   ├── jwt.js
│   └── AppError.js
├── validators/
│   └── auth.validator.js
├── app.js
└── server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI, Redis URL, and a strong `JWT_SECRET`.

4. Start MongoDB and Redis locally, then run:

```bash
npm run dev
```

## API endpoints

Base URL: `http://localhost:5000/api/auth`

### Signup

`POST /signup`

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Login

`POST /login`

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Refresh access token

`POST /refresh`

```json
{
  "refreshToken": "your_refresh_token"
}
```

### Logout

`POST /logout`

```json
{
  "refreshToken": "your_refresh_token"
}
```

### Get current user (protected)

`GET /me`

Header:

```
Authorization: Bearer <access_token>
```

## What to build next

1. Password reset flow
2. Rate limiting on login
3. Role-based access control (RBAC)
4. Email verification
5. Token rotation on refresh

## Learning path

1. Trace a signup request from `auth.routes.js` through every layer
2. Add a `change-password` endpoint using the same pattern
3. Replace manual validators with `express-validator` or `zod`
4. Add integration tests for signup and login
