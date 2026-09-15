# Debugging

## Purpose

Find and fix the root cause of bugs instead of applying superficial
patches.

## Workflow

1. Understand the reported problem.
2. Reproduce the problem if possible.
3. Inspect the relevant code.
4. Trace the data flow.
5. Identify where actual behavior differs from expected behavior.
6. Determine the root cause.
7. Explain the root cause.
8. Implement the smallest appropriate fix.
9. Re-run the reproduction.
10. Run relevant tests.
11. Check whether the same bug exists elsewhere.

## Important Rules

- Do not change unrelated code.
- Do not hide errors just to make them disappear.
- Do not add random retries or delays without understanding the cause.
- Do not modify configuration blindly.
- Do not claim a fix worked without verification.

## Root Cause

Always distinguish between:

Symptom:
What the user sees.

Root cause:
Why the system produced the symptom.

Fix:
What actually prevents the root cause.

## Final Response

Explain:

1. What caused the problem.
2. What was changed.
3. Why the change fixes it.
4. How it was verified.