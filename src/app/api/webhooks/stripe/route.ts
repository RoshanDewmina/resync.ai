
// api/webhooks/stripe/route.ts
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PlanType, BillingCycle } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
    // Read the request body as text
    const body = await request.text();
    // Retrieve the Stripe signature from the headers
    const signature = headers().get("Stripe-Signature") ?? "";

    let event: Stripe.Event;

    console.log("STRIPE_WEBHOOK_SIGNING_SECRET:", process.env.STRIPE_WEBHOOK_SIGNING_SECRET);

    try {
        // Construct Stripe event from the request body and signature
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

    switch (event.type) {
        case "checkout.session.completed": {
            await handleCheckoutSessionCompleted(session);
            break;
        }
        case "invoice.payment_succeeded": {
            await handleInvoicePaymentSucceeded(session);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
    );
    console.log("Stripe subscription:", subscription);

    if (!session?.metadata?.clerkUserId) {
        console.error("Missing clerkUserId in session metadata");
        return new NextResponse("No clerkUserId", { status: 400 });
    }

    // Ensure the user exists before creating a subscription
    const user = await db.user.findUnique({
        where: { clerkUserId: session.metadata.clerkUserId }
    });

    if (!user) {
        console.error("User not found for clerkUserId:", session.metadata.clerkUserId);
        return new NextResponse("User not found", { status: 400 });
    }

    const existingSubscription = await db.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
        await db.subscription.create({
            data: {
                userId: user.id,
                stripeCustomerId: subscription.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                planType: getPlanTypeFromPriceId(subscription.items.data[0].price.id),
                billingCycle: getBillingCycleFromPriceId(subscription.items.data[0].price.id),
                lastTokenReset: new Date()  // Initialize lastTokenReset to current date
            },
        });
    } else {
        console.error("Subscription already exists:", subscription.id);
    }
}

async function handleInvoicePaymentSucceeded(session: Stripe.Checkout.Session) {
    const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
    );
    console.log("Stripe subscription:", subscription);

    const existingSubscription = await db.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
        console.error("Subscription not found for stripeSubscriptionId:", subscription.id);
        return new NextResponse("Subscription not found", { status: 400 });
    }

    await db.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripePriceId: subscription.items.data[0].price.id,
            planType: getPlanTypeFromPriceId(subscription.items.data[0].price.id),
            billingCycle: getBillingCycleFromPriceId(subscription.items.data[0].price.id),
        },
    });
}

// Helper functions to determine plan type and billing cycle from price ID
function getPlanTypeFromPriceId(priceId: string): PlanType {
    switch (priceId) {
        case process.env.STRIPE_TRIAL_PRICE_ID: // Added case for Trial
            return "Trial"; // Return Trial plan type
        case process.env.STRIPE_LAUNCH_MONTHLY_PRICE_ID:
        case process.env.STRIPE_LAUNCH_ANNUAL_PRICE_ID:
            return "Launch";
        case process.env.STRIPE_ACCELERATE_MONTHLY_PRICE_ID:
        case process.env.STRIPE_ACCELERATE_ANNUAL_PRICE_ID:
            return "Accelerate";
        case process.env.STRIPE_SCALE_MONTHLY_PRICE_ID:
        case process.env.STRIPE_SCALE_ANNUAL_PRICE_ID:
            return "Scale";
        default:
            throw new Error("Unknown price ID");
    }
}


function getBillingCycleFromPriceId(priceId: string): BillingCycle {
    switch (priceId) {
        case process.env.STRIPE_TRIAL_PRICE_ID: // Added case for Trial
            return "OneTime"
        case process.env.STRIPE_LAUNCH_MONTHLY_PRICE_ID:
        case process.env.STRIPE_ACCELERATE_MONTHLY_PRICE_ID:
        case process.env.STRIPE_SCALE_MONTHLY_PRICE_ID:
            return "Monthly";
        case process.env.STRIPE_LAUNCH_ANNUAL_PRICE_ID:
        case process.env.STRIPE_ACCELERATE_ANNUAL_PRICE_ID:
        case process.env.STRIPE_SCALE_ANNUAL_PRICE_ID:
            return "Yearly";
        default:
            throw new Error("Unknown price ID");
    }
}

