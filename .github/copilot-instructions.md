# Copilot Instructions for WinGroX AI Codebase

## Big Picture Architecture
- **Monorepo**: Contains both frontend (`client/`) and backend (`server/`) apps, plus a standalone `products-api/`.
- **Frontend**: React (TypeScript, Tailwind CSS), organized by feature: `components/`, `pages/`, `context/`, `hooks/`, `services/`.
- **Backend**: Node.js/Express (TypeScript), with clear separation: `controllers/`, `middleware/`, `models/`, `routes/`, `services/`, `utils/`.
- **Database**: MongoDB (accessed via Mongoose models in `server/src/models/`).
- **Data Flow**: React client communicates with Express API (JWT auth, role-based access). MongoDB is used via Mongoose models. Some features (e.g., product APIs) may be served from a separate service.
- **Why**: Structure supports rapid feature iteration, clear separation of concerns, and robust admin/user flows.

## Developer Workflows
- **Start All Services**: Use `docker-compose up` for full stack, or run client/server separately:
  - Client: `cd client && npm install && npm start`
  - Server: `cd server && npm install && npm run dev`
- **Testing**: Unit/integration tests are expected for both frontend and backend. (See `README.md` for details.)
- **Debugging**: Use VS Code launch configs or `npm run dev` for hot-reload. API fallback logic is in `client/src/services/` and `server/src/services/`.
- **Admin Flows**: Direct admin dashboard bypasses JWT for emergency/maintenance (see docs and `admin-direct-access.html`).

## Project-Specific Conventions
- **API Services**: All API calls go through service modules (`client/src/services/`). Use fallback logic for reliability.
- **Role-Based UI**: Admin-only features are guarded in both UI and API routes. See `ADMIN-ACCESS-GUIDE.md` and `client/src/context/AuthContext.tsx`.
- **Error Handling**: Custom error boundaries in React; Express uses middleware for error handling and fallback.
- **Styling**: Tailwind CSS utility classes; global styles in `client/src/styles/`.
- **Type Safety**: All code is TypeScript. Shared types in `types/` folders.
- **Docs**: Key workflows and fixes are documented in markdown files at project root (search for `*-GUIDE.md`, `*-FIX.md`).

## Integration Points & Patterns
- **Database**: MongoDB is the primary database, accessed via Mongoose in backend services and models.
- **Auth**: JWT, with context in React (`AuthContext`).
- **Email**: SendGrid integration for notifications (see server/services/).
- **Marketplace**: Coach/product marketplace logic in both frontend and backend, with filtering and booking.
- **Fallbacks**: API fallback logic for reliability (see `check-products-api-format.js`, `fix-products-404.ps1`).
- **CI/CD**: GitHub Actions in `.github/workflows/main.yml` for build/test/deploy.

## Examples
- To add a new API route: create in `server/src/routes/`, controller in `controllers/`, update types in `types/`.
- To add a new page: create in `client/src/pages/`, add route in `App.tsx`, use service from `services/`.
- To add admin-only UI: wrap in role check using `AuthContext`.

## Key Files & Directories
- `client/src/components/Layout.tsx`: Main navigation, user menu, role-based UI logic
- `client/src/context/AuthContext.tsx`: Auth state, role checks
- `server/src/controllers/`, `server/src/routes/`: API logic
- `COACH-PRODUCT-MANAGEMENT.md`, `ADMIN-ACCESS-GUIDE.md`: Workflow docs

---
For more, see `README.md` and root-level `*-GUIDE.md` files. When in doubt, search for similar patterns in the codebase before introducing new ones.
