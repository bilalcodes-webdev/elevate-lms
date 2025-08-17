import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();

  const headersList = await headers();

  const stripeSignature = headersList.get("Stripe-Signature") as string;

  let events: Stripe.Event;

  try {
    events = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      env.STRIPE_WEBHOOKS_SECRET
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response("Webhooks Error", { status: 400 });
  }

  const session = events.data.object as Stripe.Checkout.Session;

  if (events.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const customerId = session.customer as string;

    if (!courseId) {
      throw new Error("Course not found");
    }

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.enrollment.update({
      where: {
        id: session.metadata?.enrollmentId as string,
      },
      data: {
        courseId: courseId,
        userId: user.id,
        status: "ACTIVE",
        amount: session.amount_total as number,
      },
    });
  }

  return new Response(null, { status: 200 });
}
