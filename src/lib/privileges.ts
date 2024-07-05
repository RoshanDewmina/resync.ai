import { db } from "@/lib/db";
import { PlanType } from "@prisma/client";
import cron from 'node-cron';

// Define the interface for PlanPrivileges
interface PlanPrivileges {
  maxProjects: number | null;
  maxIntegrationsPerProject: number | null;
  maxQuestionsPerMonth: number | null;
  maxTokens: number | null;
  maxStorageGB: number | null;
  gptModel: string | string[];
}

// Privileges configuration based on plan types
export const privileges: Record<PlanType, PlanPrivileges> = {
  Trial: {
    maxProjects: 1,
    maxIntegrationsPerProject: 1,
    maxQuestionsPerMonth: 30,
    maxTokens: 300,
    maxStorageGB: 1,
    gptModel: "gpt-3.5",
  },
  Launch: {
    maxProjects: 1,
    maxIntegrationsPerProject: 1,
    maxQuestionsPerMonth: 250,
    maxTokens: 2500,
    maxStorageGB: 1,
    gptModel: "gpt-3.5",
  },
  Accelerate: {
    maxProjects: 3,
    maxIntegrationsPerProject: 3,
    maxQuestionsPerMonth: 1000,
    maxTokens: 10000,
    maxStorageGB: 5,
    gptModel: ["gpt-3.5", "gpt-4"],
  },
  Scale: {
    maxProjects: null,
    maxIntegrationsPerProject: null,
    maxQuestionsPerMonth: null,
    maxTokens: null,
    maxStorageGB: null,
    gptModel: [],
  },
};

// Middleware to check if the user is authenticated
// export async function isAuthenticated(req, res, next) {
//   const clerkUserId = req.headers['clerk-user-id'];
//   if (!clerkUserId) {
//     return res.status(401).json({ error: 'User not authenticated' });
//   }
//   req.clerkUserId = clerkUserId;
//   next();
// }

// Function to check user privileges based on their subscription plan
export async function checkPrivileges(clerkUserId: string, requiredPrivilege: keyof PlanPrivileges) {
  // Find the user and include their subscriptions
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { subscriptions: true },
  });

  // If user or subscription not found, throw an error
  if (!user || !user.subscriptions || !user.subscriptions[0]) {
    throw new Error("User or subscription not found");
  }

  // Get the plan type from the user's subscription
  const planType = user.subscriptions[0].planType;

  // Return the required privilege from the plan
  return privileges[planType][requiredPrivilege];
}

// Function to track usage of tokens and questions
export async function trackUsage(clerkUserId: string, tokensUsed: number, questionsAsked: number) {
  // Find the user and include their subscriptions and token usage
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { subscriptions: true, TokenUsage: true },
  });

  // If user or subscription not found, throw an error
  if (!user || !user.subscriptions || !user.subscriptions[0]) {
    throw new Error("User or subscription not found");
  }

  const subscription = user.subscriptions[0];
  const planPrivileges = privileges[subscription.planType];

  // Get current month and year for tracking
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const lastResetMonth = subscription.lastTokenReset.getMonth() + 1;
  const lastResetYear = subscription.lastTokenReset.getFullYear();

  // // Reset tokens if needed
  // if (currentMonth !== lastResetMonth || currentYear !== lastResetYear) {
  //   await resetMonthlyTokens(clerkUserId);
  // }

  // Check the user's monthly question usage
  const monthlyUsage = await db.questionUsage.findFirst({
    where: {
      userId: user.id,
      month: currentMonth,
      year: currentYear,
    },
  });

  // Calculate total questions asked
  const totalQuestionsAsked = (monthlyUsage?.questions || 0) + questionsAsked;
  if (planPrivileges.maxQuestionsPerMonth !== null && totalQuestionsAsked > planPrivileges.maxQuestionsPerMonth) {
    throw new Error("Question limit reached for the month");
  }

  // Calculate total tokens used
  const totalTokensUsed = user.TokenUsage.reduce((acc, usage) => acc + usage.tokens, 0) + tokensUsed;
  if (planPrivileges.maxTokens !== null && totalTokensUsed > planPrivileges.maxTokens) {
    throw new Error("Token limit reached");
  }

  // Update question usage
  if (monthlyUsage) {
    await db.questionUsage.update({
      where: { id: monthlyUsage.id },
      data: { questions: totalQuestionsAsked },
    });
  } else {
    await db.questionUsage.create({
      data: {
        userId: user.id,
        questions: questionsAsked,
        month: currentMonth,
        year: currentYear,
      },
    });
  }

  // Update token usage
  await db.tokenUsage.create({
    data: {
      userId: user.id,
      tokens: tokensUsed,
      reason: 'Question asked',
    },
  });

  // Update integration's monthly usage
  await db.integration.updateMany({
    where: { project: { userId: user.id } },
    data: {
      monthlyUsage: { increment: tokensUsed },
    },
  });
}

// Function to track storage usage
export async function trackStorageUsage(clerkUserId: string, storageUsed: number) {
  // Find the user and include their storage and subscriptions
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { Storage: true, subscriptions: true },
  });

  // If user, storage, or subscription not found, throw an error
  if (!user || !user.Storage || !user.subscriptions || !user.subscriptions[0]) {
    throw new Error("User, storage, or subscription not found");
  }

  const subscription = user.subscriptions[0];
  const planPrivileges = privileges[subscription.planType];

  // Calculate total storage used
  const totalStorageUsed = user.Storage[0].storageUsed + storageUsed;
  if (planPrivileges.maxStorageGB !== null && totalStorageUsed > planPrivileges.maxStorageGB * 1024) { // converting GB to MB
    throw new Error("Storage limit reached");
  }

  // Update storage usage
  await db.storage.update({
    where: { userId: user.id },
    data: { storageUsed: totalStorageUsed },
  });
}

// Commented out the previous resetMonthlyTokens function and related code
// Function to reset monthly tokens for a user
// async function resetMonthlyTokens(clerkUserId: string) {
//   // Find the user and include their subscriptions and token usage
//   const user = await db.user.findUnique({
//     where: { clerkUserId },
//     include: { subscriptions: true, TokenUsage: true },
//   });

//   // If user or subscription not found, throw an error
//   if (!user || !user.subscriptions || !user.subscriptions[0]) {
//     throw new Error("User or subscription not found");
//   }

//   const subscription = user.subscriptions[0];
//   const planPrivileges = privileges[subscription.planType];

//   // Create a token usage record for the monthly reset
//   await db.tokenUsage.create({
//     data: {
//       userId: user.id,
//       tokens: planPrivileges.maxTokens ?? 0,
//       reason: 'Monthly reset',
//     },
//   });

//   // Reset integration's monthly usage to 0
//   await db.integration.updateMany({
//     where: { project: { userId: user.id } },
//     data: { monthlyUsage: 0 },
//   });

//   // Update the last token reset date for the subscription
//   await db.subscription.update({
//     where: { userId: user.id },
//     data: { lastTokenReset: new Date() },
//   });
// }

// // Schedule a task to reset tokens at the start of each month
// cron.schedule('0 0 1 * *', async () => {
//   // Find all users and include their subscriptions
//   const users = await db.user.findMany({
//     include: { subscriptions: true },
//   });

//   // Reset monthly tokens for each user
//   for (const user of users) {
//     await resetMonthlyTokens(user.clerkUserId);
//   }
// });

// New function to delete tokens if not used within the last 90 days
async function deleteUnusedTokens(clerkUserId: string) {
  // Find the user and include their subscriptions and token usage
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { subscriptions: true, TokenUsage: true },
  });

  // If user or subscription not found, throw an error
  if (!user || !user.subscriptions || !user.subscriptions[0]) {
    throw new Error("User or subscription not found");
  }

  const subscription = user.subscriptions[0];
  const planPrivileges = privileges[subscription.planType];

  // Calculate the date 90 days ago from today
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Check if any tokens have been used in the last 90 days
  const lastTokenUsage = user.TokenUsage
    .filter((usage) => usage.createdAt > ninetyDaysAgo)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (lastTokenUsage.length === 0) {
    // If no tokens have been used in the last 90 days, delete the tokens
    await db.tokenUsage.deleteMany({
      where: { userId: user.id },
    });

    // Update integration's monthly usage to 0
    await db.integration.updateMany({
      where: { project: { userId: user.id } },
      data: { monthlyUsage: 0 },
    });

    console.log(`Tokens for user ${clerkUserId} have been deleted due to inactivity.`);
  } else {
    // Update the last token reset date to the most recent usage date
    await db.subscription.update({
      where: { userId: user.id },
      data: { lastTokenReset: lastTokenUsage[0].createdAt },
    });

    console.log(`Tokens for user ${clerkUserId} have been updated to reflect recent usage.`);
  }
}

// // Schedule a task to check and delete unused tokens every day
// cron.schedule('0 0 * * *', async () => {
//   // Find all users and include their subscriptions
//   const users = await db.user.findMany({
//     include: { subscriptions: true },
//   });

//   // Check and delete unused tokens for each user
//   for (const user of users) {
//     await deleteUnusedTokens(user.clerkUserId);
//   }
// });
