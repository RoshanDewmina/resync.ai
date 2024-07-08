import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { divMode } from "@tsparticles/engine";
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

    const { planType, tokens } = await request.json();

    const _userSubscriptions = await db.subscription.findMany({
      where: {
        userId: user.id,
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
    switch (tokens) {
      case 2500:
        priceId = process.env.PRICE_ID_20;
        break;
      case 7000:
        priceId = process.env.PRICE_ID_50;
        break;
      case 15000:
        priceId = process.env.PRICE_ID_100;
        break;
      case 40000:
        priceId = process.env.PRICE_ID_250;
        break;
      case 80000:
        priceId = process.env.PRICE_ID_500;
        break;
      case 170000:
        priceId = process.env.PRICE_ID_1000;
        break;
      case 350000:
        priceId = process.env.PRICE_ID_2000;
        break;
      case 900000:
        priceId = process.env.PRICE_ID_5000;
        break;
      default:
        throw new Error("Invalid number of tokens");
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: planType === "OneTime" ? "payment" : "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        clerkUserId,
        tokens: planType === "OneTime" ? tokens.toString() : undefined,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}


// <div className="flex items-center justify-center space-x-2">
                   
                   
                    
//                   </div>