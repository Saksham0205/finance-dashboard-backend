# API Testing Guide

Complete curl commands for testing every endpoint. Run the server first:

```bash
npm run start:dev
```

> Replace `<TOKEN>` with the JWT token from the login response.
> Replace `<USER_ID>` and `<TRANSACTION_ID>` with actual MongoDB ObjectIds from responses.

---

## Auth

### Register a new user (default role: viewer)

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (201):**
```json
{
  "id": "660a1f2e3b4c5d6e7f8a9b0c",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "viewer"
}
```

### Register with a specific role

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Response (201):**
```json
{
  "id": "660a1f2e3b4c5d6e7f8a9b0c",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin"
}
```

### Register — invalid role

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad User",
    "email": "bad@example.com",
    "password": "bad123456",
    "role": "superadmin"
  }'
```

**Response (400):**
```json
{
  "error": "Bad Request",
  "detail": "role must be one of the following values: viewer, analyst, admin"
}
```

### Register — duplicate email

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (409):**
```json
{
  "error": "Conflict",
  "detail": "A user with this email already exists"
}
```

### Register — validation errors

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "not-an-email",
    "password": "12"
  }'
```

**Response (400):**
```json
{
  "error": "Bad Request",
  "detail": "name should not be empty; email must be an email; password must be longer than or equal to 6 characters"
}
```

### Login

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login — invalid credentials

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "detail": "Invalid email or password"
}
```

### Login — deactivated account

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "deactivated@example.com",
    "password": "password123"
  }'
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "detail": "Account is deactivated"
}
```

---

## Transactions

### Create a transaction (admin only)

```bash
curl -s -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2026-01-15",
    "notes": "January salary",
    "userId": "<USER_ID>"
  }'
```

**Response (201):**
```json
{
  "userId": "660a1f2e3b4c5d6e7f8a9b0c",
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2026-01-15T00:00:00.000Z",
  "notes": "January salary",
  "_id": "660b2a3c4d5e6f7a8b9c0d1e",
  "createdAt": "2026-04-01T19:23:43.085Z",
  "updatedAt": "2026-04-01T19:23:43.085Z"
}
```

### Create a transaction (non-admin — forbidden)

```bash
curl -s -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VIEWER_TOKEN>" \
  -d '{
    "amount": 100,
    "type": "income",
    "category": "Test",
    "date": "2026-03-01",
    "userId": "<USER_ID>"
  }'
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "detail": "Role 'viewer' does not have access to this resource"
}
```

### List all transactions (all roles)

```bash
curl -s http://localhost:3000/transactions \
  -H "Authorization: Bearer <TOKEN>"
```

### List transactions — filter by type

```bash
curl -s "http://localhost:3000/transactions?type=expense" \
  -H "Authorization: Bearer <TOKEN>"
```

### List transactions — filter by category

```bash
curl -s "http://localhost:3000/transactions?category=Salary" \
  -H "Authorization: Bearer <TOKEN>"
```

### List transactions — filter by date range

```bash
curl -s "http://localhost:3000/transactions?startDate=2026-01-01&endDate=2026-01-31" \
  -H "Authorization: Bearer <TOKEN>"
```

### List transactions — combine filters

```bash
curl -s "http://localhost:3000/transactions?type=expense&startDate=2026-01-01&endDate=2026-12-31&category=Rent" \
  -H "Authorization: Bearer <TOKEN>"
```

### Update a transaction (admin only)

```bash
curl -s -X PUT http://localhost:3000/transactions/<TRANSACTION_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "amount": 5500,
    "notes": "January salary (updated)"
  }'
```

**Response (200):**
```json
{
  "_id": "660b2a3c4d5e6f7a8b9c0d1e",
  "userId": "660a1f2e3b4c5d6e7f8a9b0c",
  "amount": 5500,
  "type": "income",
  "category": "Salary",
  "date": "2026-01-15T00:00:00.000Z",
  "notes": "January salary (updated)",
  "createdAt": "2026-04-01T19:23:43.085Z",
  "updatedAt": "2026-04-01T19:24:08.757Z"
}
```

### Delete a transaction (admin only)

```bash
curl -s -X DELETE http://localhost:3000/transactions/<TRANSACTION_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
  "message": "Transaction deleted successfully"
}
```

### Transaction not found

```bash
curl -s -X DELETE http://localhost:3000/transactions/000000000000000000000000 \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (404):**
```json
{
  "error": "Not Found",
  "detail": "Transaction 000000000000000000000000 not found"
}
```

### No auth token

```bash
curl -s http://localhost:3000/transactions
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "detail": "Valid authentication token is required"
}
```

---

## Users (admin only)

### List all users

```bash
curl -s http://localhost:3000/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Response (200):**
```json
[
  {
    "_id": "660a1f2e3b4c5d6e7f8a9b0c",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-04-01T19:22:52.000Z"
  }
]
```

### List users (non-admin — forbidden)

```bash
curl -s http://localhost:3000/users \
  -H "Authorization: Bearer <VIEWER_TOKEN>"
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "detail": "Role 'viewer' does not have access to this resource"
}
```

### Change user role

```bash
curl -s -X PATCH http://localhost:3000/users/<USER_ID>/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "role": "analyst"
  }'
```

**Response (200):**
```json
{
  "_id": "660a1f2e3b4c5d6e7f8a9b0c",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "analyst",
  "isActive": true,
  "createdAt": "2026-04-01T19:22:52.000Z"
}
```

### Change role — invalid role value

```bash
curl -s -X PATCH http://localhost:3000/users/<USER_ID>/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "role": "superadmin"
  }'
```

**Response (400):**
```json
{
  "error": "Bad Request",
  "detail": "role must be one of the following values: viewer, analyst, admin"
}
```

### Deactivate a user

```bash
curl -s -X PATCH http://localhost:3000/users/<USER_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "isActive": false
  }'
```

**Response (200):**
```json
{
  "_id": "660a1f2e3b4c5d6e7f8a9b0c",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "analyst",
  "isActive": false,
  "createdAt": "2026-04-01T19:22:52.000Z"
}
```

### Reactivate a user

```bash
curl -s -X PATCH http://localhost:3000/users/<USER_ID>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "isActive": true
  }'
```

---

## Dashboard

### Summary — total income, expenses, net balance (all roles)

```bash
curl -s http://localhost:3000/dashboard/summary \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
{
  "totalIncome": 10700,
  "totalExpenses": 1650,
  "netBalance": 9050
}
```

### Recent — last 10 transactions (all roles)

```bash
curl -s http://localhost:3000/dashboard/recent \
  -H "Authorization: Bearer <TOKEN>"
```

**Response (200):**
```json
[
  {
    "_id": "660b2a3c4d5e6f7a8b9c0d1e",
    "userId": "660a1f2e3b4c5d6e7f8a9b0c",
    "amount": 150,
    "type": "expense",
    "category": "Utilities",
    "date": "2026-02-20T00:00:00.000Z",
    "notes": "Electric bill"
  }
]
```

### By category — grouped totals (analyst + admin)

```bash
curl -s http://localhost:3000/dashboard/by-category \
  -H "Authorization: Bearer <ANALYST_TOKEN>"
```

**Response (200):**
```json
[
  {
    "total": 10700,
    "count": 2,
    "category": "Salary",
    "type": "income"
  },
  {
    "total": 1200,
    "count": 1,
    "category": "Rent",
    "type": "expense"
  },
  {
    "total": 300,
    "count": 1,
    "category": "Groceries",
    "type": "expense"
  },
  {
    "total": 150,
    "count": 1,
    "category": "Utilities",
    "type": "expense"
  }
]
```

### By category (viewer — forbidden)

```bash
curl -s http://localhost:3000/dashboard/by-category \
  -H "Authorization: Bearer <VIEWER_TOKEN>"
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "detail": "Role 'viewer' does not have access to this resource"
}
```

### Trends — monthly breakdown (analyst + admin)

```bash
curl -s http://localhost:3000/dashboard/trends \
  -H "Authorization: Bearer <ANALYST_TOKEN>"
```

**Response (200):**
```json
[
  {
    "totalIncome": 5500,
    "totalExpenses": 1200,
    "transactionCount": 2,
    "year": 2026,
    "month": 1,
    "netBalance": 4300
  },
  {
    "totalIncome": 5200,
    "totalExpenses": 450,
    "transactionCount": 3,
    "year": 2026,
    "month": 2,
    "netBalance": 4750
  }
]
```

### Trends (viewer — forbidden)

```bash
curl -s http://localhost:3000/dashboard/trends \
  -H "Authorization: Bearer <VIEWER_TOKEN>"
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "detail": "Role 'viewer' does not have access to this resource"
}
```

---

## Quick Start Script

Run this to set up test users and get tokens in one go:

```bash
# Register three users with roles
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"admin123","role":"admin"}'

curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Analyst User","email":"analyst@test.com","password":"analyst123","role":"analyst"}'

curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Viewer User","email":"viewer@test.com","password":"viewer123"}'

# Login and save tokens
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

ANALYST_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@test.com","password":"analyst123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

VIEWER_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@test.com","password":"viewer123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])")

echo "ADMIN_TOKEN=$ADMIN_TOKEN"
echo "ANALYST_TOKEN=$ANALYST_TOKEN"
echo "VIEWER_TOKEN=$VIEWER_TOKEN"
```

Then use the tokens with any curl command above:

```bash
curl -s http://localhost:3000/dashboard/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
