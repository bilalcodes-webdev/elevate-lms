import { fixedWindow } from "@arcjet/next";
/* eslint-disable @typescript-eslint/no-unused-vars */
import aj from "@/lib/arcjet";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";
import { detectBot } from "@arcjet/next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";

const arcjet = aj

  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function DELETE(request: Request) {
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

    const key = body.key;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
