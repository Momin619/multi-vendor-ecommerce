# Code Review

## Purpose

Review code for correctness, architecture, security, maintainability,
performance, and unnecessary complexity.

## Review Process

1. Inspect the relevant files.
2. Inspect the git diff when reviewing changes.
3. Understand the intended behavior.
4. Trace the data flow.
5. Look for bugs and edge cases.
6. Check architecture.
7. Check security.
8. Check TypeScript quality.
9. Check database usage.
10. Check error handling.
11. Check tests.
12. Report findings by severity.

## Severity Levels

### CRITICAL

Problems that can cause:

- data loss
- authentication bypass
- authorization bypass
- severe security vulnerabilities
- application-wide failures

### HIGH

Problems that can cause:

- incorrect business behavior
- exposed sensitive information
- serious performance issues
- broken important functionality

### MEDIUM

Problems that should be fixed but are less severe.

Examples:

- duplicated logic
- weak error handling
- poor validation
- maintainability problems

### LOW

Minor improvements such as:

- naming
- readability
- small refactoring opportunities

Do not report purely stylistic preferences as bugs.

## Architecture

Check that:

Controller
→ Service
→ Database

responsibilities remain separated.

Controllers should not contain database queries.

Services should not depend on Express request/response objects.

## TypeScript

Check for:

- unnecessary `any`
- unsafe assertions
- incorrect optional handling
- duplicated types
- weak typing
- unreachable code

## Security

Check:

- authentication
- authorization
- resource ownership
- validation
- SQL injection
- sensitive data exposure
- JWT handling
- cookie configuration
- password handling
- rate limiting
- file upload security

## Database

Check:

- parameterized queries
- transactions
- indexes
- pagination
- unnecessary queries
- N+1 query patterns
- constraints

## Review Output

Report findings in this format:

[SEVERITY] Short title

File:
line:

Problem:
Explain what is wrong.

Why it matters:
Explain the impact.

Suggested fix:
Explain the appropriate solution.

If no significant issues are found, clearly state that.
Do not invent problems.