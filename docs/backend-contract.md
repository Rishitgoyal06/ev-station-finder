# Frontend to Python Backend Contract

This app is set up so the Next.js frontend owns routing and UI, while the Python backend owns the database and business logic.

## Architecture

- Frontend pages call local Next.js API routes under `/api/*`
- Next.js API routes proxy requests to the Python backend
- Python backend talks to the database and returns JSON
- Frontend never imports database models directly

## Backend Base URL

Set one of these in `frontend/.env.local`:

```env
BACKEND_BASE_URL=http://localhost:8000
```

or

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

## Required Endpoints

### Auth

`POST /auth/login`

- Accepts JSON:
```json
{
  "email": "user@example.com",
  "username": "user@example.com",
  "password": "password123"
}
```
- Returns:
```json
{
  "ok": true,
  "user": {
    "id": "u1",
    "name": "Ravi",
    "email": "user@example.com",
    "role": "user",
    "avatar": ""
  },
  "token": "jwt-or-session-token"
}
```

`POST /auth/register`

- Accepts:
```json
{
  "name": "Ravi",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

`POST /auth/google`

- Accepts:
```json
{
  "credential": "google-id-token",
  "userInfo": { "email": "user@example.com", "name": "Ravi" },
  "role": "user"
}
```

`GET /auth/status`

- Returns:
```json
{
  "authenticated": true,
  "user": {
    "id": "u1",
    "name": "Ravi",
    "email": "user@example.com",
    "role": "user",
    "avatar": ""
  }
}
```

`POST /auth/logout`

- Optional, if you want server-side session cleanup

### Bookings

`GET /bookings`

- Returns:
```json
{
  "bookings": []
}
```

`GET /bookings/:id`

- Returns:
```json
{
  "booking": {
    "id": "BK123",
    "userId": "u1",
    "stationName": "GreenCharge Hub",
    "address": "City Center",
    "date": "2026-08-23",
    "time": "14:30",
    "connector": "CCS2",
    "amount": 420,
    "status": "confirmed",
    "slotNumber": "A2",
    "estimatedCharge": "45 min",
    "image": "",
    "vehicleInfo": "",
    "paymentMethod": "UPI",
    "transactionId": "txn_123",
    "bookedAt": "2026-08-23T10:00:00.000Z",
    "instructions": ""
  }
}
```

`POST /bookings`

- Creates a booking

### Slots

`PATCH /slots/:id`

- Accepts:
```json
{
  "status": "available"
}
```

- Valid statuses:
  - `available`
  - `occupied`
  - `maintenance`
  - `reserved`

### Admin

`GET /admin/users`

- Returns:
```json
{
  "users": []
}
```

`GET /summary`

- Returns dashboard counts used by admin, owner, and user dashboards:
```json
{
  "totalUsers": 0,
  "totalStations": 0,
  "totalOwners": 0,
  "totalBookings": 0,
  "activeBookings": 0,
  "completedBookings": 0,
  "totalRevenue": 0,
  "availableSlots": 0,
  "occupiedSlots": 0,
  "reservedSlots": 0,
  "maintenanceSlots": 0,
  "totalDrivers": 0
}
```

## Notes

- The frontend currently normalizes roles so `customer` becomes `user` and `station_owner` becomes `owner`.
- The frontend expects JSON responses and will forward auth cookies/headers when available.
- If you want Python to own auth entirely, keep token/cookie names consistent with `chargeiq_token`.
