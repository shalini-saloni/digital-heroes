# Digital Heroes

A full-stack React + Express + MongoDB project for a charity-themed user platform.

## Tech Stack

- Frontend: React, Vite, Axios, React Router
- Backend: Express, Mongoose, JWT authentication
- Database: MongoDB with optional in-memory fallback via `mongodb-memory-server`

## Setup

### 1. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Configure environment

Create or update `server/.env` with these values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/digital-heroes
JWT_SECRET=supersecret123
ADMIN_EMAIL=admin@digitalheroes.co.in
ADMIN_PASSWORD=adminpass
PORT=5000
```

> If the local MongoDB instance is unavailable, the server falls back to an in-memory database for development.

### 3. Run the app

Start the backend:

```bash
cd server
node server.js
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend typically runs on `http://localhost:5175` and the backend on `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - authenticate a user
- `GET /api/auth/me` - get current user profile
- `POST /api/auth/subscribe` - subscribe user to a plan
- `PUT /api/auth/profile` - update charity preferences
- `GET /api/charities` - list charities
- `GET /api/scores` - list user scores
- `POST /api/scores` - create a score record
- `GET /api/draws/my-results` - get user draw results

## Notes

- The server loads environment variables from `server/.env`.
- `axios.defaults.baseURL` is configured in `client/src/main.jsx` to point at the backend.
- CORS is enabled in the server to allow browser requests from the frontend.
