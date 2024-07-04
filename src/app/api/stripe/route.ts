
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + "/";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkUserId ?? undefined },
    });

    if (!clerkUserId || !user) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const { planType, billingCycle } = await request.json();

    const _userSubscriptions = await db.subscription.findMany({
      where: {
        userId: clerkUserId,
      },
    });

    if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscriptions[0].stripeCustomerId,
        return_url,
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    let priceId;
    switch (planType) {
      case "Launch":
        switch (billingCycle) {
          case "Monthly":
            priceId = process.env.STRIPE_LAUNCH_MONTHLY_PRICE_ID;
            break;
          case "Annual":
            priceId = process.env.STRIPE_LAUNCH_ANNUAL_PRICE_ID;
            break;
          default:
            throw new Error("Invalid billing cycle");
        }
        break;
      case "Accelerate":
        switch (billingCycle) {
          case "Monthly":
            priceId = process.env.STRIPE_ACCELERATE_MONTHLY_PRICE_ID;
            break;
          case "Annual":
            priceId = process.env.STRIPE_ACCELERATE_ANNUAL_PRICE_ID;
            break;
          default:
            throw new Error("Invalid billing cycle");
        }
        break;
      case "Scale":
        switch (billingCycle) {
          case "Monthly":
            priceId = process.env.STRIPE_SCALE_MONTHLY_PRICE_ID;
            break;
          case "Annual":
            priceId = process.env.STRIPE_SCALE_ANNUAL_PRICE_ID;
            break;
          default:
            throw new Error("Invalid billing cycle");
        }
        break;
      default:
        throw new Error("Invalid plan type");
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        clerkUserId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}