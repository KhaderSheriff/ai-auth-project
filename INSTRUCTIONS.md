# Student Authentication Project — Instructions

This document specifies the requirements, architecture choices, security rules, and conventions for a simple student-friendly authentication application. Follow these instructions exactly before implementing any code.

---

## Project Goal

Build a minimal, maintainable authentication app with:
- Sign Up
- Login
- Logout
- Protected Dashboard / Dummy page

This project is intended for a student assignment — keep the design simple and explainable.

---

## Technology Stack (required)
- Next.js with TypeScript (App Router)
- Tailwind CSS
- MongoDB
- Mongoose
- bcrypt for password hashing
- HTTP-only cookies for authentication
- Zod for input validation

Do NOT introduce Redis, Docker, Express, Prisma, PostgreSQL, or separate frontend/backend apps.

---

## Repository Structure (required)

Use the following repository layout exactly:

app/
├── login/
├── signup/
├── dashboard/
└── api/
    ├── auth/
    │   ├── signup/
    │   ├── login/
    │   └── logout/

lib/
└── db.ts

models/
└── User.ts

components/

Keep code organized into these folders; do not split frontend and backend into separate repos.

---

## Required Features (implement later)

1. Sign Up page (`app/signup`) that collects name, email, and password.
2. Sign Up API endpoint (`app/api/auth/signup/route.ts`) that validates input and creates users.
3. Persist user records in MongoDB using Mongoose `User` model.
4. Hash passwords using `bcrypt` before storing them (store only the hash).
5. Login page (`app/login`) that collects email and password.
6. Login API endpoint (`app/api/auth/login/route.ts`) that verifies credentials.
7. Authentication using HTTP-only cookies (set from server Route Handlers).
8. Protected dashboard/dummy page (`app/dashboard`) accessible only when authenticated.
9. Logout endpoint (`app/api/auth/logout/route.ts`) that clears/invalidate the auth cookie.
10. Redirect unauthenticated users away from the dashboard to the login page.

---

## Authentication Flow (high level)

### Sign Up
- Client submits sign up form to `/api/auth/signup`.
- Server validates input with Zod.
- Server checks for existing user by unique email.
- Server hashes the password with `bcrypt` and stores the user in MongoDB.
- On success, return an appropriate 201 response (do not auto-login unless explicitly designed).

### Login
- Client submits login form to `/api/auth/login`.
- Server validates input with Zod.
- Server finds user by email and compares password with `bcrypt.compare`.
- On success, server creates an authentication session by issuing an HTTP-only cookie.
- Server returns success and client redirects to `/dashboard`.

### Protected Page
- `app/dashboard` checks for valid auth cookie on the server (Server Components or middleware).
- If authenticated, render the protected content.
- If not authenticated, redirect to `/login`.

### Logout
- Client calls `/api/auth/logout`.
- Server clears the authentication cookie (set cookie with empty value and immediate expiry).
- Client is redirected to `/login`.

---

## Database & Model

- Use MongoDB via Mongoose. Keep connection logic in `lib/db.ts`.
- Create a `User` model at `models/User.ts` with fields:
  - `name: string`
  - `email: string` (unique, indexed)
  - `password: string` (bcrypt hash only)
  - `createdAt: Date` (default now)

- Ensure the Mongoose schema enforces `email` uniqueness and suitable validation.

---

## Input Validation

- Validate all request bodies using Zod schemas on the server Route Handlers.
- Validate on the client as well for better UX, but always enforce validation server-side.

---

## Authentication Details

- Use HTTP-only, `Secure` (in production), `SameSite=Lax` or `Strict` cookies for storing a session identifier.
- Keep session logic simple: a signed cookie containing a server-side session id or a short-lived token.
- Keep server-side verification in middleware or server-centric checks so protected pages are validated on the server.

Note: JWTs may be used but must be stored and validated safely; prefer simple HTTP-only cookie sessions for this student project.

---

## Security Rules (mandatory)

- Never store plain-text passwords. Always hash with bcrypt.
- Validate all inputs with Zod (server-side required).
- Store secret values (DB URI, cookie secret) in `.env.local` and never commit them.
- Use HTTP-only cookies to protect tokens from JavaScript access.
- Apply rate-limiting or simple brute-force protection on auth endpoints (even a basic counter or lockout is fine).
- Use generic error messages on auth failures to avoid account enumeration.
- Sanitize and validate any user-provided data used in queries.
- Use HTTPS in production; ensure `Secure` cookie flag when appropriate.

---

## Coding Conventions

- Use TypeScript throughout (backend and frontend).
- Functional React components only.
- Use `async/await` for async operations and central error handling.
- Keep database connection logic inside `lib/db.ts`.
- Keep Mongoose models inside `models/`.
- Implement API logic in Next.js Route Handlers under `app/api/.../route.ts`.
- Place reusable UI inside `components/`.
- Write small, focused functions; avoid monolithic handlers.
- Use ESLint + Prettier (recommended) and consistent formatting.
- Use clear, descriptive variable and function names.

---

## Testing & Verification Checklist

For each feature, implement then verify as follows:

Sign Up
- Valid registration succeeds and returns 201.
- Duplicate email is rejected with a clear error code.
- Invalid input is rejected (zod error handling).
- Stored password is a bcrypt hash (not plain text).

Login
- Valid credentials produce a success response and set the auth cookie.
- Invalid credentials are rejected with a generic error.

Protected Dashboard
- Unauthenticated users are redirected to `/login`.
- Authenticated users access `/dashboard` successfully.

Logout
- Logout clears the auth cookie.
- After logout, user cannot access `/dashboard`.

Verification steps (for every feature):
1. Implement the feature.
2. Run the app locally.
3. Exercise the feature manually or via tests.
4. Check runtime logs for errors.
5. Fix any issues discovered.
6. Re-run tests and confirm no regressions.

---

## Environment & Secrets

- Add `.env.local` to root with required vars such as `MONGODB_URI` and `COOKIE_SECRET`.
- Do not commit `.env.local` to source control.

Example `.env.local` contents (do not commit):

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/mydb
COOKIE_SECRET=some-long-random-secret
```

---

## Development Notes

- Keep the implementation minimal and pedagogical — prefer clarity over cleverness.
- Avoid adding infrastructure complexity (no Docker, Redis, or extra services).
- Keep the UI simple: plain forms and clear messages; Tailwind CSS for styling.

---

## AI Agent Rules (developer-facing)

- Before modifying files, inspect the project structure and follow this `INSTRUCTIONS.md` file.
- Do not introduce technologies outside the specified stack.
- Do not overwrite existing files unnecessarily.
- Explain important changes when they are made.
- Ask before making major architectural changes.

---

## First Task (do this now)

Create only this `INSTRUCTIONS.md` file containing the project requirements and guidelines.

Do NOT create or modify any of the following yet:
- Signup page
- Login page
- Dashboard
- API routes
- Database code
- Authentication code

After creating this file, stop and await further instructions from the project owner.

---

End of instructions.
