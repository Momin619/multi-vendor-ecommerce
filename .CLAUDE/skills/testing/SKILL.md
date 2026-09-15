# Testing

## Purpose

Create meaningful tests that verify behavior rather than simply increasing
test coverage.

## Test Categories

Consider:

- happy paths
- validation failures
- authentication failures
- authorization failures
- edge cases
- database failures
- duplicate data
- empty results
- invalid input
- boundary values

## API Testing

For each endpoint consider:

- valid request
- missing required fields
- invalid fields
- unauthenticated request
- unauthorized request
- resource ownership
- expected status code
- expected response
- error response

## Authentication Testing

For authentication-related functionality consider:

- valid credentials
- invalid credentials
- expired tokens
- missing tokens
- invalid tokens
- refresh behavior
- cookie behavior
- rate limiting

## Product Authorization

For seller-owned resources verify:

Seller A
→ can modify own product

Seller B
→ cannot modify Seller A's product

Customer
→ cannot perform seller-only operations

## Test Quality

- Avoid tests that only reproduce implementation details.
- Prefer testing observable behavior.
- Keep tests independent.
- Clean up test data.
- Do not make tests dependent on execution order.

## Verification

Run the relevant tests after changes.

Never claim tests passed unless they were actually executed.