# Financial Dashboard Backend

NestJS + MongoDB backend with JWT authentication and role-based access control.

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
- `GET /users` — List all users
- `PATCH /users/:id/role` — Change role
- `PATCH /users/:id/status` — Activate/deactivate

### Dashboard (requires auth)
- `GET /dashboard/summary` — Income, expenses, net balance (all roles)
- `GET /dashboard/recent` — Last 10 transactions (all roles)
- `GET /dashboard/by-category` — Totals by category (analyst+)
- `GET /dashboard/trends` — Monthly breakdown (analyst+)
