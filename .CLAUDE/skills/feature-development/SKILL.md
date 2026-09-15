# Feature Development

## Purpose

Use this skill when implementing a new feature or making a substantial
change to the existing application.

The goal is to understand the existing architecture first, make the
smallest appropriate changes, and verify the implementation before
finishing.

## General Rules

- Inspect the existing code before making changes.
- Do not assume file names, architecture, database structure, or APIs.
- Follow the existing project architecture unless there is a strong reason
  to improve it.
- Do not rewrite unrelated code.
- Do not introduce unnecessary dependencies.
- Prefer simple solutions over clever abstractions.
- Keep TypeScript strongly typed.
- Do not use `any` unless there is a clear justification.
- Reuse existing utilities and patterns when appropriate.

## Development Workflow

Follow these steps:

1. Understand the requested feature.
2. Inspect the relevant existing files.
3. Identify affected layers and dependencies.
4. Create a short implementation plan.
5. Check whether database changes are required.
6. Implement the backend.
7. Implement the frontend if required.
8. Add validation and error handling.
9. Add or update tests.
10. Run TypeScript/type checks.
11. Run linting if configured.
12. Run relevant tests.
13. Inspect the final git diff.
14. Review the implementation for unnecessary changes.
15. Summarize what was changed and what was verified.

## Backend Architecture

Follow this separation:

Route
→ Controller
→ Service
→ Database

### Routes

Routes should define:

- HTTP method
- URL
- middleware
- controller

Routes should not contain business logic.

### Controllers

Controllers should handle:

- request data
- calling services
- HTTP responses

Controllers should NOT contain database queries or substantial business logic.

### Services

Services contain:

- business logic
- database operations
- transactions
- business rules

Services should not depend on Express `req` or `res`.

### Validation

Use the project's existing Zod validation patterns.

Validate user-controlled input before using it.

## Database

- Use PostgreSQL through the existing database layer.
- Use parameterized queries.
- Never construct SQL using string concatenation with user input.
- Consider indexes for frequently queried columns.
- Use transactions when multiple related database operations must succeed
  or fail together.

## Authentication and Authorization

For protected endpoints:

1. Authenticate the user.
2. Determine the user's role.
3. Check resource ownership where required.
4. Only then perform the protected operation.

Do not rely only on frontend authorization.

## Error Handling

Use the project's existing error-handling system.

Do not create a completely different error format for one endpoint.

Return appropriate HTTP status codes.

## Frontend

Follow the existing React architecture.

- Keep components focused.
- Keep API communication in the existing API/service layer.
- Do not put large amounts of business logic directly inside JSX.
- Reuse existing components where appropriate.
- Handle loading, error, empty, and success states.

## Final Verification

Before considering the feature complete:

- Check changed files.
- Check git diff.
- Run type checking.
- Run relevant tests.
- Verify API behavior where possible.
- Verify frontend behavior where possible.

Never claim something was tested if it was not actually tested.