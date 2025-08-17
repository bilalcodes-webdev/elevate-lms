"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/type";

import prisma from "@/lib/prisma";
import aj, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const arctjet = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export const deleteCourse = async (id: string): Promise<ApiResponse> => {
  const session = await requireAdmin();

  try {
    if (!id) return { status: "error", message: "require course id not found" };

    const req = await request();

    const decision = await arctjet.protect(req, {
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

    await prisma.course.delete({
      where: { id: id },
    });

    return {
      status: "success",
      message: "Course deleted successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.message);
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
};
