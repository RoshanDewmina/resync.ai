// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";

// const DAY_IN_MS = 1000 * 60 * 60 * 24;

// export const checkSubscription = async () => {
//   const { userId: clerkUserId } = await auth();
//   if (!clerkUserId) {
//     return false;
//   }

//   const _userSubscriptions = await db.subscription.findMany({
//     where: {
//       userId: clerkUserId,
//     },
//   });

//   if (!_userSubscriptions[0]) {
//     return false;
//   }

//   const userSubscription = _userSubscriptions[0];

//   const isValid =
//     userSubscription.stripePriceId &&
//     userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
//       Date.now();

//   return !!isValid;
// };
