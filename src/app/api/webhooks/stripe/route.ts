// api/webhooks/stripe/route.ts
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PlanType, BillingCycle } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") ?? "";

    let event: Stripe.Event;

    console.log("STRIPE_WEBHOOK_SIGNING_SECRET:", process.env.STRIPE_WEBHOOK_SIGNING_SECRET);

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
        );
        console.log("Stripe event:", event);
    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse("Webhook error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Stripe session:", session);

    if (event.type === "checkout.session.completed") {
        await handleCheckoutSessionCompleted(session);
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log("Handling checkout session completed:", session);

    if (!session?.metadata?.clerkUserId) {
        console.error("Missing clerkUserId in session metadata");
        return new NextResponse("No clerkUserId", { status: 400 });
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: session.metadata.clerkUserId }
    });

    if (!user) {
        console.error("User not found for clerkUserId:", session.metadata.clerkUserId);
        return new NextResponse("User not found", { status: 400 });
    }

    try {
        const tokens = parseInt(session.metadata.tokens) || 0;
        const amount = (session.amount_total ?? 0) / 100; // Safely handle possible null value

        // Update user's token balance
        await db.user.update({
            where: { id: user.id },
            data: {
                tokens: {
                    increment: tokens
                }
            }
        });

        // Create a token purchase record
        await db.tokenPurchase.create({
            data: {
                userId: user.id,
                tokens: tokens,
                amount: amount
            }
        });

        // If the purchase includes a subscription, handle subscription creation
        if (session.subscription) {
            await db.subscription.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    stripePriceId: session.metadata.priceId ?? null,
                    planType: PlanType.OneTime,
                    billingCycle: BillingCycle.OneTime,
                    lastTokenReset: new Date()
                },
            });
        }
    } catch (error) {
        console.error("Error handling checkout session completed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
