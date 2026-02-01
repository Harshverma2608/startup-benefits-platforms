# Startup Benefits Platform

Full-stack assignment: a small app where users can sign up, browse deals, and claim them. Frontend is Next.js (App Router) with TypeScript and Tailwind. Backend is Node, Express, and MongoDB with Mongoose.

---

## 1. End-to-end application flow

User lands on the home page and can go to deals or sign up. After registering or logging in, the backend returns a JWT and the frontend keeps it in localStorage and in a React context. User can browse all deals on the Deals page and open a single deal at `/deals/[id]` to see full description, partner, eligibility and a claim button. When they claim a deal, the backend creates a Claim with status pending. Unauthenticated users get redirected to login when they try to claim. On the Dashboard, the user sees their profile and a list of claimed deals with status (pending, approved, rejected, expired).

---

## 2. Authentication and authorization strategy

Register and login are done via `POST /api/auth/register` and `POST /api/auth/login`. The backend uses express-validator for input, checks that the email is not already taken on register, and on login compares the password with bcrypt. It returns a JWT (signed with JWT_SECRET, payload has userId, 7 days expiry) and the user object (id, name, email, isVerified). The frontend stores the token and user in localStorage and in AuthContext, and for protected API calls it sends the header `Authorization: Bearer <token>`.

Protected routes on the backend use an `authenticate` middleware. It takes the token from the Authorization header, verifies the JWT, finds the user by userId, puts them on req.user, and sends 401 if the token is missing, invalid or expired or if the user is not found. On the frontend, the dashboard and the claim action need the token; if the user is not logged in they get redirected to login or to the deals page.

The User model has isVerified and verificationReason. There is a requireVerification middleware that can be used to block unverified users; it is not yet used on the claim route (see limitations).

---

## 3. Internal flow of claiming a deal

The frontend sends POST to `/api/claims` with body `{ dealId }` and the Bearer token in the header. The authenticate middleware runs first and sets req.user. The handler checks that dealId is present, then loads the deal by id and checks it is active. If not found it returns 404. It then checks if this user already has a claim for this deal; if yes it returns 400. Otherwise it creates a new Claim with user, deal, status pending, saves it, populates the deal field and returns 201 with the claim. The frontend shows a simple success message and the user can see the claim in the dashboard.

---

## 4. Interaction between frontend and backend

The frontend calls the API at the URL in NEXT_PUBLIC_API_URL or defaults to http://localhost:5000/api. The backend runs on PORT (default 5000).

Endpoints: Register and login (POST, no auth). Get current user (GET /api/auth/me, with auth). List deals GET /api/deals with optional query category and featured. Get one deal GET /api/deals/:id. Claim deal POST /api/claims with body dealId (auth required). Get my claims GET /api/claims/my-claims (auth required).

The frontend expects the login/register response to have data.token and data.user and stores them. On page load it reads from localStorage in a useEffect to restore auth state.

---

## 5. Known limitations and weak points

The Deal model has requiresVerification but the claim API does not check it yet, so unverified users can claim any deal. I would need to add a check in the claim handler and use requireVerification when the deal is locked.

The deals listing page does not link to the deal detail page; you can only get there from the dashboard link or by typing the URL. Adding a link on each deal card would help.

There is no search on deals, only optional filters for category and featured.

The token is stored in localStorage which is not ideal for production; cookies or a refresh token flow would be better.

Some API errors are shown as generic messages; validation errors could be shown per field on the frontend.

---

## 6. Improvements for production readiness

Auth: use httpOnly cookies or a proper refresh token flow, and rate limit login/register. Enforce verification on locked deals and add a way for admins to verify users. Validation: reuse rules and return field-level errors. Security: strong JWT_SECRET from env, proper CORS, no stack traces in responses. Deals: add pagination and search. Add logging and error tracking. Add tests for auth and claim flow. The backend already has a simple /api/health; could add a DB check there.

---

## 7. UI and performance considerations

Loading: the main pages (deals list, deal detail, dashboard, login/register) show a spinner while loading. The claim button shows "Claiming..." when submitting. Layout uses Tailwind so it works on smaller screens. The assignment asked for animations; the current UI has basic hover and disabled states. More animations (e.g. page transitions or skeleton loaders) could be added without changing the flow. The frontend fetches deals and claims on mount without a global cache; for many deals, pagination would help.

---

## How to run

Backend: cd backend, npm install, then npm start. You can set .env with MONGODB_URI, JWT_SECRET, PORT. Default MongoDB URL is mongodb://localhost:27017/startup-benefits and port is 5000.

Frontend: cd frontend, npm install, then npm run dev. You can set .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000/api. Open the URL it prints (e.g. http://localhost:3000). Make sure the backend and MongoDB are running.

---

## Repository structure

Backend has the Express app, Mongoose models for User, Deal and Claim, routes for auth, deals and claims, and the JWT auth middleware. Frontend is a Next.js App Router app with pages for home, deals list, deal detail login, register and dashboard, plus AuthContext and a Navbar, styled with Tailwind.
