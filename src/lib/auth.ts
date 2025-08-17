// import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import resend from "./resend";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await resend.emails.send({
          from: "Elevate LMS <onboarding@resend.dev>",
          to: [email],
          subject: `Your Elevate LMS ${
            type === "sign-in" ? "Login" : "Verification"
          } Code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
              <h2 style="color: #333;">🔐 ${
                type === "sign-in" ? "Login" : "Verify"
              } Your Email</h2>
              <p>Hello,</p>
              <p>Here is your verification code for <strong>Elevate LMS</strong>:</p>
              <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #ff6600; text-align: center;">
                ${otp}
              </div>
              <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
              <p>If you did not request this, you can safely ignore this email.</p>
              <hr style="margin: 30px 0;" />
              <p style="font-size: 12px; color: #888;">Thanks, <br/>Elevate LMS Team</p>
            </div>
          `,
        });
      },
    }), // ✅ close emailOTP()
  ], // ✅ close plugins array
}); // ✅ close betterAuth()
