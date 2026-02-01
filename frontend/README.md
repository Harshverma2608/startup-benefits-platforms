# Startup Benefits Platform

This is a small full-stack project built as an assignment. It allows
users to sign up, log in, browse startup deals, and claim them. The main
goal was to practice authentication, protected routes, and
frontend--backend integration.

## Tech Stack

-   Frontend: Next.js (App Router), TypeScript, Tailwind CSS\
-   Backend: Node.js, Express.js\
-   Database: MongoDB with Mongoose\
-   Authentication: JWT

## Features

-   User registration and login
-   JWT-based authentication
-   View all available deals
-   View deal details
-   Claim deals (logged-in users only)
-   Dashboard to track claimed deals and status

## How It Works

After login or signup, the backend returns a JWT token. The frontend
stores the token and sends it in the Authorization header for protected
requests. Users can browse deals and claim them. Claimed deals are
stored with a pending status and shown on the dashboard.

## API Endpoints

-   POST /api/auth/register\
-   POST /api/auth/login\
-   GET /api/auth/me\
-   GET /api/deals\
-   GET /api/deals/:id\
-   POST /api/claims\
-   GET /api/claims/my-claims

## Limitations

-   Deal verification is not enforced yet
-   Token is stored in localStorage
-   No search or pagination
-   Basic frontend error handling

## How to Run

### Backend

    cd backend
    npm install
    npm start



### Frontend

    cd frontend
    npm install
    npm run dev


