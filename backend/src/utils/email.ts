import { env } from "../config/env.js";

interface EmailJsResponse {
  status?: number;
  text?: string;
}



/**
 * Sends the password-reset OTP using EmailJS.
 *
 * EmailJS is configured with a Gmail account, so that account
 * becomes the sender of the email.
 */
export const sendPasswordResetOtpEmail = async (
  to: string,
  otp: string,
): Promise<void> => {


  const response = await fetch(
    "https://api.emailjs.com/api/v1.0/email/send",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        service_id: env.EMAILJS_SERVICE_ID,

        template_id: env.EMAILJS_TEMPLATE_ID,

        user_id: env.EMAILJS_PUBLIC_KEY,

        accessToken: env.EMAILJS_PRIVATE_KEY,

        template_params: {
          otp,

          expires_in:
            env.OTP_EXPIRES_IN_MINUTES,

          to_email: to,
        },
      }),
    },
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[EmailJS API Error]:", {
      status: response.status,
      response: responseText,
    });

    throw new Error(
      "Failed to send password reset email",
    );
  }
};