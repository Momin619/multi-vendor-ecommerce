import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";
import request from "supertest";

import app from "../../app.js";
import { pool } from "../../database/pool.js";
import { hashPassword } from "../../utils/password.js";
import { resetRateLimitBucketsForTests } from "../../middlewares/token-bucket.middleware.js";

vi.mock("../../utils/email.js", () => ({
  sendPasswordResetOtpEmail: vi.fn().mockResolvedValue(undefined),
}));

import { sendPasswordResetOtpEmail } from "../../utils/email.js";

const sendOtpMock = vi.mocked(sendPasswordResetOtpEmail);

const ORIGINAL_PASSWORD = "OriginalPass123";

const createUser = async (
  email: string,
  password = ORIGINAL_PASSWORD,
): Promise<void> => {
  const passwordHash = await hashPassword(password);

  await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'customer')
    `,
    ["Test User", email, passwordHash],
  );
};

/**
 * Requests a reset OTP through the real endpoint and returns the
 * plaintext code captured by the mocked email function.
 */
const requestOtp = async (email: string): Promise<string> => {
  await request(app)
    .post("/api/auth/forgot-password")
    .send({ email });

  const call = sendOtpMock.mock.calls.at(-1);
  return call![1];
};

const login = (email: string, password: string) =>
  request(app).post("/api/auth/login").send({ email, password });

beforeEach(() => {
  sendOtpMock.mockClear();
  resetRateLimitBucketsForTests();
});

describe("POST /api/auth/reset-password", () => {
  it("resets the password with a correct OTP and consumes it", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(200);

    const oldLogin = await login("user@example.com", ORIGINAL_PASSWORD);
    expect(oldLogin.status).toBe(401);
    expect(oldLogin.body.errorCode).toBe("AUTH_INVALID_CREDENTIALS");

    const newLogin = await login("user@example.com", "BrandNewPass123");
    expect(newLogin.status).toBe(200);

    const result = await pool.query(
      `SELECT consumed_at FROM password_reset_otps`,
    );
    expect(result.rows[0].consumed_at).not.toBeNull();
  });

  it("rejects an unknown email", async () => {
    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "nobody@example.com",
        otp: "123456",
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("AUTH_OTP_INVALID");
  });

  it("rejects when no OTP has ever been requested", async () => {
    await createUser("user@example.com");

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp: "123456",
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("AUTH_OTP_INVALID");
  });

  it("rejects an incorrect OTP and records the attempt", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");
    const wrongOtp = otp === "111111" ? "222222" : "111111";

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp: wrongOtp,
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("AUTH_OTP_INVALID");

    const result = await pool.query(
      `SELECT attempts FROM password_reset_otps`,
    );
    expect(result.rows[0].attempts).toBe(1);
  });

  it("locks the code out after 5 incorrect attempts, even with the right code", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");
    const wrongOtp = otp === "111111" ? "222222" : "111111";

    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          email: "user@example.com",
          otp: wrongOtp,
          newPassword: "BrandNewPass123",
        });

      expect(response.status).toBe(400);
    }

    const lockedResponse = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "BrandNewPass123",
      });

    expect(lockedResponse.status).toBe(429);
    expect(lockedResponse.body.errorCode).toBe(
      "AUTH_OTP_TOO_MANY_ATTEMPTS",
    );
  });

  it("rejects an expired OTP", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");

    await pool.query(
      `UPDATE password_reset_otps SET expires_at = NOW() - interval '1 minute'`,
    );

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("AUTH_OTP_EXPIRED");
  });

  it("rejects a reused, already-consumed OTP", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");

    const firstResponse = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "BrandNewPass123",
      });
    expect(firstResponse.status).toBe(200);

    const secondResponse = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "AnotherNewPass123",
      });

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.errorCode).toBe("AUTH_OTP_INVALID");
  });

  it("rejects a new password equal to the current password", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: ORIGINAL_PASSWORD,
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("AUTH_NEW_PASSWORD_SAME");
  });

  it("rejects a malformed OTP", async () => {
    await createUser("user@example.com");

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp: "12ab",
        newPassword: "BrandNewPass123",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("VALIDATION_ERROR");
  });

  it("rejects a new password shorter than 8 characters", async () => {
    await createUser("user@example.com");
    const otp = await requestOtp("user@example.com");

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp,
        newPassword: "short",
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("VALIDATION_ERROR");
  });

  it("rate-limits repeated verification attempts from the same client", async () => {
    /**
     * No OTP is ever requested, so every call hits "no active OTP"
     * (400 AUTH_OTP_INVALID) rather than the separate 5-attempt
     * per-OTP lockout — isolating the IP-based rate limiter itself.
     */
    await createUser("user@example.com");

    for (let i = 0; i < 8; i++) {
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({
          email: "user@example.com",
          otp: "123456",
          newPassword: "BrandNewPass123",
        });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe("AUTH_OTP_INVALID");
    }

    const ninthResponse = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp: "123456",
        newPassword: "BrandNewPass123",
      });

    expect(ninthResponse.status).toBe(429);
  });
});
