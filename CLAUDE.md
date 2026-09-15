# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A multi-vendor e-commerce app with two independent apps in one repo:

- `backend/` — Express 5 + TypeScript (ESM) + PostgreSQL (`pg`), cookie-based JWT auth
- `frontend/` — React 19 + TypeScript + Vite + Tailwind CSS v4

There is no root-level package.json — each app is developed and run independently from its own directory.

## Commands

### Backend (run from `backend/`)

```
npm run dev         # tsx watch src/server.ts — dev server with hot reload
npm run build        # tsc — compiles to dist/
npm start            # node dist/server.js — run compiled build
npm run db:migrate   # tsx src/database/migrate.ts — apply pending SQL migrations
```

No test runner or lint script is configured for the backend.

### Frontend (run from `frontend/`)

```
npm run dev       # vite — dev server
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # vite preview — serve the production build locally
```

No test runner is configured for the frontend.

### Database migrations

SQL files live in `backend/src/database/migrations/`, named `NNN_description.sql` and applied in filename order. `migrate.ts` tracks applied migrations in a `schema_migrations` table and skips ones already run — each migration runs inside its own transaction. To add a migration, create the next-numbered `.sql` file; there's no down/rollback mechanism.

## Environment variables

Both apps require a `.env` file (gitignored) in their own directory.

**Backend** (`backend/.env`, validated eagerly in `src/config/env.ts` — missing required vars crash at startup): `DATABASE_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`. Optional with defaults: `PORT` (5000), `NODE_ENV`, `ACCESS_TOKEN_EXPIRES_IN` (15m), `REFRESH_TOKEN_EXPIRES_IN` (7d), `OTP_EXPIRES_IN_MINUTES` (10).

**Frontend** (`frontend/.env`): `VITE_API_URL` — the backend's base API URL (e.g. `http://localhost:5000/api`).

Always add new config through `env` (backend) so missing vars fail fast at startup rather than causing obscure runtime errors — never read `process.env`/`import.meta.env` directly elsewhere.

## Architecture

### Backend: layered module structure

Each feature lives under `src/modules/<name>/` with a consistent file split:

- `*.routes.ts` — wires middleware chains (`authenticate` → `authorize(role)` → `validate(schema)` → controller) to endpoints
- `*.controller.ts` — thin: parses `req`, calls the service, sends the response via `sendSuccess`
- `*.service.ts` — all business logic and raw SQL (`pool.query`), throws `AppError` on failure
- `*.schemas.ts`/`*.schema.ts` — Zod schemas used by `validate` middleware
- `*.types.ts` — TS types for the module

Existing modules: `auth` (register/login/refresh/logout/me/forgot-password/reset-password) and `products` (seller-owned CRUD, cursor-paginated list), plus a standalone `dashboard` module (`customer`/`sellerDashboard`).

### Request pipeline

`server.ts` wires global middleware in order: `logger` → `express.json()` → `cookieParser()` → `cors` (currently hardcoded to `http://localhost:5173`, `credentials: true`) → mounted routers (`/api/auth`, `/api`, `/api/products`) → `notFoundMiddleware` → `errorMiddleware` (must stay last).

Route-level middleware order matters, e.g. in `products.routes.ts`: `authenticate` → `authorize(role)` → `uploadProductImage` (multer/Cloudinary) → `validate(schema, "body")` → controller. File upload must run before body validation so `req.body` is fully populated first.

### Auth: cookie-based JWT with refresh rotation

- Access + refresh tokens are separate JWTs (`utils/jwt.ts`), each carrying a `type: "access" | "refresh"` claim that's checked on use.
- Both are set as `httpOnly` cookies (`config/cookie.ts`) — never read from an `Authorization` header. `secure`/`sameSite` toggle based on `NODE_ENV`.
- `middlewares/auth.middleware.ts` (`authenticate`) reads `req.cookies.accessToken`, verifies it, and attaches `req.user = { userId, role }` (typed via `src/types/express.d.ts`).
- `middlewares/authorize.middleware.ts` (`authorize(...roles)`) gates by `req.user.role`; must run after `authenticate`.
- `POST /api/auth/refresh` rotates both tokens from the refresh cookie.
- Frontend's `api/axios.ts` response interceptor auto-calls `/auth/refresh` and retries the original request on a 401 with `AUTH_ACCESS_TOKEN_EXPIRED`, then falls back to `notifySessionExpired()` (`auth/session.ts`) if the refresh itself fails — this drives `AuthContext` back to logged-out.
- Password reset is OTP-based (`password_reset_otps` table): request always responds identically whether or not the email exists (`auth.service.ts`'s `requestPasswordResetOtp`), attempts are capped (`MAX_OTP_ATTEMPTS = 5`), and password update + OTP consumption happen in one DB transaction.

### Errors: AppError + centralized error middleware

All expected failures are thrown as `new AppError(message, statusCode, errorCode)` (`utils/AppError.ts`), where `errorCode` comes from the single source of truth `utils/errorCodes.ts` (`ERROR_CODES`/`ErrorCode`). `middlewares/error.middleware.ts` is the only place that converts caught errors into HTTP responses, handling `AppError`, `ZodError` (400 + field errors), and JWT errors, in that order, before a generic 500 fallback. When adding a new failure case, add a code to `ERROR_CODES` and throw `AppError` from the service layer — don't send error responses manually from controllers.

All success responses go through `sendSuccess(res, message, data, statusCode?)` (`utils/response.ts`) for a consistent `{ success: true, message, data }` shape; errors follow `{ success: false, message, errorCode, errors? }`.

### Rate limiting

`middlewares/token-bucket.middleware.ts` implements an in-memory (per-process, non-persistent) token-bucket keyed by `req.ip`. Pre-configured limiters (`loginLimiter`, `registerLimiter`, `forgotPasswordLimiter`, `resetPasswordLimiter`) are applied per-route in `auth.routes.ts`. Password-reset endpoints are deliberately the strictest since each request sends an email.

### Products: ownership-scoped, cursor-paginated, image-coupled

- Every query in `products.service.ts` scopes by both `id` and `seller_id` — sellers can only ever see/modify their own products; there's no separate admin/public listing endpoint.
- Listing uses opaque-cursor pagination (`utils/cursor.ts`): the cursor base64-encodes `{ createdAt, id }`, keyed off an `(created_at, id)` composite ordering for stable pagination. One extra row is fetched to compute `hasMore`.
- Product images go through `middlewares/upload.middleware.ts` (multer + `multer-storage-cloudinary`) straight to Cloudinary before the controller runs. `updateProduct`/`deleteProduct` reconcile Cloudinary state with the DB write: on update, the old image is deleted only after the DB write succeeds; if the DB write fails, the newly-uploaded image is deleted to avoid orphaning it. Cloudinary cleanup failures are logged, not thrown — they never fail the primary DB operation.

### Frontend: context + protected routing

- `context/AuthContext.tsx` is the single source of truth for `user`/`isAuthenticated`/`isLoading`, exposed via the `useAuth` hook. On mount it calls `GET /auth/me`; a 401 is silently treated as logged-out (the axios interceptor already tried refreshing).
- `routes/ProtectedRoute.tsx` gates on auth only (redirects to `/login`, preserving `location.state.from`); `routes/RoleRoute.tsx` (nested inside it) additionally gates on `user.role`, redirecting to the *other* role's dashboard rather than `/login` when the role doesn't match. Both wait for `isLoading` before deciding.
- `api/*.api.ts` files wrap the shared `api` (axios) instance per resource; `api/axios.ts` owns the single global refresh/retry interceptor — don't duplicate 401-handling in individual API modules.
- Path structure mirrors role: `/dashboard/customer`, `/dashboard/seller`, `/seller/products`, `/seller/products/create`, `/seller/products/:id`, `/seller/products/:id/edit`.

## Notes

- The root-level `momin619-multi-vendor-ecommerce-*.txt` file is a flattened full-repo text dump (gitignored via `*.txt`) — not a source file to edit.
- Backend cookies/CORS assume the frontend runs on `http://localhost:5173`; update `server.ts`'s `cors()` origin if that changes.
