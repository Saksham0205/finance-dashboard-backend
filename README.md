# Financial Dashboard Backend

A REST API for managing financial transactions, built with NestJS and MongoDB. Supports JWT auth, role-based access control, and a dashboard with summaries and trends.

Live API docs: https://finance-dashboard-backend-sigv.onrender.com/api/docs

## Live API

- Base URL: https://finance-dashboard-backend-sigv.onrender.com
- Swagger docs: https://finance-dashboard-backend-sigv.onrender.com/api/docs

## Frontend

I also built a Next.js + Tailwind frontend to interact with the API:

https://financial-dashboard-frontend-nine.vercel.app/

It covers login/registration with JWT, role-based UI (viewers, analysts, and admins each see different things), transaction CRUD for admins, a dashboard with summary cards and charts, and user management.

> The focus of this project is the backend — the frontend is there to show how the API works end-to-end with role-based access, not as a standalone frontend submission. The backend API and Swagger docs are the primary submission: https://finance-dashboard-backend-sigv.onrender.com/api

## Quick Test Flow

### Option 1 — Via Frontend (easiest)
1. Go to https://financial-dashboard-frontend-nine.vercel.app/
2. Register a user with role `admin`
3. Log in and explore the dashboard, transactions, and user management
4. Register a `viewer` and `analyst` to see how role restrictions work

### Option 2 — Via Swagger UI
1. Go to https://finance-dashboard-backend-sigv.onrender.com/api
2. `POST /auth/register` to create an admin user
3. `POST /auth/login` to get a JWT token
4. Click "Authorize" and paste the token
5. Test all endpoints from there

### Option 3 — Via Postman
1. Import `postman_collection.json` from this repo
2. Set `base_url` to `https://finance-dashboard-backend-sigv.onrender.com`
3. Register + login to get a JWT token
4. Set it as Bearer token in the collection auth

## Roles

| Role    | Permissions                                                     |
|---------|-----------------------------------------------------------------|
| Viewer  | GET transactions, GET dashboard/summary, GET dashboard/recent   |
| Analyst | All viewer + GET dashboard/by-category, GET dashboard/trends    |
| Admin   | Full access: CRUD transactions, user management, all dashboard  |

## Setup

```bash
npm install
```

Create a `.env` file (see `.env` for defaults):

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=financial_dashboard
JWT_SECRET=your_secret_here
JWT_EXPIRE_MINUTES=60
```

## Run

```bash
npm run start:dev
```

## API Docs

- Swagger UI at `http://localhost:3000/api/docs` once the server is running
- Curl examples for every endpoint in [API_REFERENCE.md](./API_REFERENCE.md)

## Endpoints

### Auth
- `POST /auth/register` — register a new user (pass `role`: viewer, analyst, or admin)
- `POST /auth/login` — login, returns JWT token and user data

### Transactions (requires auth)
- `POST /transactions` — create (admin only)
- `GET /transactions` — list with filters (all roles)
- `PUT /transactions/:id` — update (admin only)
- `DELETE /transactions/:id` — delete (admin only)

### Users (admin only)
- `GET /users` — list all users (optional `name` and `email` query params for filtering)
- `PATCH /users/:id/role` — change a user's role
- `PATCH /users/:id/status` — activate or deactivate a user

### Dashboard (requires auth)
- `GET /dashboard/summary` — income, expenses, net balance (all roles)
- `GET /dashboard/recent` — last 10 transactions (all roles)
- `GET /dashboard/by-category` — totals by category (analyst+)
- `GET /dashboard/trends` — monthly breakdown (analyst+)

## Tech Stack

- NestJS
- MongoDB + Mongoose
- JWT + Passport for auth
- class-validator for input validation
- @nestjs/swagger for API docs

## Testing with Postman

There's a `postman_collection.json` in the project root. Import it into Postman, set `base_url` to `https://finance-dashboard-backend-sigv.onrender.com` (or `http://localhost:3000` for local), register an admin, and use the JWT token as Bearer auth on the collection.

## Getting Started

If you're evaluating this project, here's a quick walkthrough:

1. Register an admin — `POST /auth/register` with `role: "admin"`
2. Login — `POST /auth/login` to get a JWT token and user details
3. Set the token as Bearer in the Authorization header
4. Create some transactions via `POST /transactions`
5. Hit the dashboard endpoints to see aggregated data
6. Create viewer/analyst users and verify they can't access admin-only routes

## Deployment

The API is deployed on Render and the database is on MongoDB Atlas (free tier). Environment variables are set in the Render dashboard. You don't need a local MongoDB setup to test — just use the live URL above.

## Assumptions

I made a few design decisions worth calling out:

- Users can pick their own role during registration. This is intentional — it makes testing way easier. In production, you'd obviously restrict role assignment to admins.
- The first admin has to be created through `/auth/register` with `role: "admin"` since there's no seed data.
- Transactions are global, not scoped per user. Every role can see all transactions.
- Deletes are hard deletes — no soft delete. `DELETE` removes the record permanently.
