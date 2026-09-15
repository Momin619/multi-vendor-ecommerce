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

const GENERIC_MESSAGE =
  "If that email is registered, a reset code has been sent.";

const createUser = async (
  email: string,
  password = "OriginalPass123",
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

const getOtpRows = async (email: string) => {
  const result = await pool.query(
    `
      SELECT prot.*
      FROM password_reset_otps prot
      JOIN users u ON u.id = prot.user_id
      WHERE u.email = $1
      ORDER BY prot.created_at DESC
    `,
    [email],
  );

  return result.rows;
};

beforeEach(() => {
  sendOtpMock.mockClear();
  resetRateLimitBucketsForTests();
});

describe("POST /api/auth/forgot-password", () => {
  it("emails an OTP and inserts a row for a registered email", async () => {
    await createUser("user@example.com");

    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "user@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(GENERIC_MESSAGE);

    expect(sendOtpMock).toHaveBeenCalledTimes(1);

    const [to, otp] = sendOtpMock.mock.calls[0]!;
    expect(to).toBe("user@example.com");
    expect(otp).toMatch(/^\d{6}$/);

    const rows = await getOtpRows("user@example.com");
    expect(rows).toHaveLength(1);
    expect(rows[0].consumed_at).toBeNull();
  });

  it("responds identically for an unknown email and sends nothing", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@example.com" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(GENERIC_MESSAGE);

    expect(sendOtpMock).not.toHaveBeenCalled();

    const rows = await getOtpRows("nobody@example.com");
    expect(rows).toHaveLength(0);
  });

  it("rejects a malformed email with a validation error", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe("VALIDATION_ERROR");
    expect(sendOtpMock).not.toHaveBeenCalled();
  });

  it("invalidates the previous OTP when a new one is requested", async () => {
    await createUser("user@example.com");

    await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "user@example.com" });

    const firstOtp = sendOtpMock.mock.calls[0]![1];

    await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "user@example.com" });

    const secondOtp = sendOtpMock.mock.calls[1]![1];

    const rows = await getOtpRows("user@example.com");
    expect(rows).toHaveLength(1);

    const resetResponse = await request(app)
      .post("/api/auth/reset-password")
      .send({
        email: "user@example.com",
        otp: firstOtp,
        newPassword: "BrandNewPass123",
      });

    expect(resetResponse.status).toBe(400);
    expect(resetResponse.body.errorCode).toBe("AUTH_OTP_INVALID");

    expect(secondOtp).not.toBe(firstOtp);
  });

  it("rate-limits repeated requests from the same client", async () => {
    await createUser("user@example.com");

    for (let i = 0; i < 3; i++) {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "user@example.com" });

      expect(response.status).toBe(200);
    }

    const fourthResponse = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "user@example.com" });

    expect(fourthResponse.status).toBe(429);
  });
});
