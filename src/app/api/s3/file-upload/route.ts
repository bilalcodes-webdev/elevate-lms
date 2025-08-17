/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3-client";
import aj from "@/lib/arcjet";
import { fixedWindow } from "@arcjet/next";
import { requireAdmin } from "@/app/data/admin/require-admin";

const fileSchema = z.object({
  fileName: z.string().min(1, { message: "File is required" }),
  isImage: z.boolean(),
  size: z.number().min(1, { message: " Size is required" }),
  contentType: z.string().min(1, { message: "Content is required" }),
});

const arcjet = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function POST(request: Request) {
  const sessions = await requireAdmin();

  const decision = await arcjet.protect(request, {
    fingerprint: sessions?.user.id as string,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "You exceeded the limit" },
        { status: 429 }
      );
    }
  }

  try {
    const body = await request.json();

    const validation = fileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey.trim(),
    });

    const preSignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600, // 1 hour
    });

    const response = {
      preSignedUrl,
      key: uniqueKey.trim(),
    };

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Failed To Generate Presigned Url",
      },
      { status: 500 }
    );
  }
}
