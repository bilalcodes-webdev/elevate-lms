"use server";

import { requireUser } from "@/app/data/user/require-user";
import { ApiResponse } from "@/lib/type";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { redirect } from "next/navigation";
import aj, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const arcjet = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export const enrollInCourseAction = async (
  courseId: string
): Promise<ApiResponse | never> => {
  const session = await requireUser();

  let checkoutUrl: string;
  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You are blocked due to rate limit, please try again later",
        };
      } else {
        return {
          status: "error",
          message: "You are bot!, Plese contact support",
        };
      }
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, slug: true, price: true },
    });

    if (!course) {
      return { status: "error", message: "Course not found" };
    }

    // Get stripeCustomerId if exists
    let stripeCustomerId = (
      await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
      })
    )?.stripeCustomerId;

    // Create new Stripe customer if not exists
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: { userId: session.user.id },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: courseId,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status === "ACTIVE") {
        return {
          status: "success",
          message: "You are already enrolled in this course",
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "PENDING",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: session.user.id,
            courseId: course.id,
            status: "PENDING",
            amount: course.price,
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: "price_1RwM3F2VatdKTUG6HvPPNdlz",
            quantity: 1,
          },
        ],
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        mode: "payment",
        metadata: {
          userId: session.user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;

  } catch (error) {
    if (error instanceof stripe.errors.StripeAPIError) {
      return {
        status: "error",
        message: "Payment system error, please try again",
      };
    }

    return {
      status: "error",
      message: "Something went wrong, please try again",
    };
  }


  redirect(checkoutUrl);
};
