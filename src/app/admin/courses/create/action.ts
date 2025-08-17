"use server";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/type";
import aj from "@/lib/arcjet";
import { fixedWindow, request } from "@arcjet/next";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { stripe } from "@/lib/stripe";

const arcjet = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export const CreateCourse = async (
  data: CourseSchemaType
): Promise<ApiResponse> => {
  const session = await requireAdmin();

  const req = await request();
  try {
    const decision = await arcjet.protect(req, {
      fingerprint: session.user.id as string,
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

    const validate = courseSchema.safeParse(data);

    if (!validate.success) {
      return {
        status: "error",
        message: "Validation failed",
      };
    }

    const stripedata = await stripe.products.create({
      name: validate.data.title,
      description: validate.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validate.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validate.data,
        userId: session?.user.id as string,
        stripePriceId: stripedata.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
};
