# Financial Dashboard Backend

NestJS + MongoDB backend with JWT authentication and role-based access control.

🚀 **Live API Docs:** https://finance-dashboard-backend-sigv.onrender.com/api/docs

## Live API

- **Base URL:** https://finance-dashboard-backend-sigv.onrender.com
- **Swagger Docs:** https://finance-dashboard-backend-sigv.onrender.com/api/docs

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

- Swagger UI: `http://localhost:3000/api/docs` (after starting the server)
- Curl commands for every endpoint: [API_REFERENCE.md](./API_REFERENCE.md)

## Endpoints

### Auth
- `POST /auth/register` �� Register a new user (optional `role` field: viewer, analyst, admin)
- `POST /auth/login` — Login, returns JWT token

### Transactions (requires auth)
- `POST /transactions` — Create (admin)
- `GET /transactions` — List with filters (all roles)
- `PUT /transactions/:id` — Update (admin)
- `DELETE /transactions/:id` — Delete (admin)

### Users (admin only)
- `GET /users` — List all users (supports optional `name` and `email` query params for search)
- `PATCH /users/:id/role` — Change role
- `PATCH /users/:id/status` — Activate/deactivate

### Dashboard (requires auth)
- `GET /dashboard/summary` — Income, expenses, net balance (all roles)
- `GET /dashboard/recent` — Last 10 transactions (all roles)
- `GET /dashboard/by-category` — Totals by category (analyst+)
- `GET /dashboard/trends` — Monthly breakdown (analyst+)

## Tech Stack

- **NestJS** — framework
- **MongoDB** — database
- **Mongoose** — ODM
- **JWT + Passport** — authentication
- **class-validator** — input validation
- **@nestjs/swagger** — API documentation

## Testing with Postman

A Postman collection is included in the repository as `postman_collection.json`.

To use it:
1. Open Postman
2. Click **Import**
3. Select `postman_collection.json` from the project root
4. Set the `base_url` variable to `https://finance-dashboard-backend-sigv.onrender.com` (or `http://localhost:3000` for local development)
5. Register an admin user first, copy the JWT token, and set it as Bearer token in the collection authorization

## Getting Started

Step-by-step flow for evaluators:

1. **Register an admin user** — `POST /auth/register` with `role: "admin"`
2. **Login** — `POST /auth/login` to get the JWT token
3. **Set the token** — Use the token as Bearer token in the Authorization header for all subsequent requests
4. **Create transactions** — `POST /transactions` to add some data
5. **Test dashboard endpoints** — Query the dashboard routes to see aggregated data
6. **Test role restrictions** — Create viewer/analyst users and verify they cannot access admin-only endpoints

## Deployment

- Hosted on **Render** (Web Service)
- Database hosted on **MongoDB Atlas** (M0 free tier)
- Environment variables are configured directly in the Render dashboard
- No local MongoDB installation required to test the APIs — use the live URL above

## Assumptions

- Role can be passed during registration for simplicity and ease of testing
- In a production system, role assignment would be restricted to admins only
- The first admin must be created via `/auth/register` with `role: "admin"`
- Transactions are global (not scoped per user) so all roles see all records
- Soft delete is not implemented; `DELETE` permanently removes the record
