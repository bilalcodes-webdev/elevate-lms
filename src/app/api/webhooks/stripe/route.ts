import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList =await headers();
  const stripeSignature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      env.STRIPE_WEBHOOKS_SECRET
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (courseId && customerId) {
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: {
            courseId,
            userId: user.id,
            status: "ACTIVE",
            amount: session.amount_total ?? 0,
          },
        });
      } else {
        console.warn("⚠️ No user found for customer:", customerId);
      }
    }
  }

  // Always return 200 to Stripe after processing
  return new Response(null, { status: 200 });
}
