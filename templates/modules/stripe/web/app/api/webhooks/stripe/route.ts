import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // TODO: Handle the payment success (e.g., update user in Supabase)
    console.log(`Payment successful for user: ${session.metadata?.userId}`);
  }

  return new NextResponse(null, { status: 200 });
}
