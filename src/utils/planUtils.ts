// utils/planUtils.ts
import { db } from '@/lib/db';

// Define the PlanDetails type
type PlanDetails = {
  tokens: number;
  models: string[];
  features: string[];
};

// Define the PLAN_DETAILS constant with the PlanDetails type
const PLAN_DETAILS: { [key: string]: PlanDetails } = {
  Trial: { tokens: 150, models: ['GPT-3.5'], features: ['basic_support'] },
  Launch: { tokens: 500, models: ['GPT-3.5'], features: ['basic_support'] },
  Expand: { tokens: 1500, models: ['GPT-3.5', 'GPT-4'], features: ['priority_support', 'enhanced_analytics'] },
  Thrive: { tokens: 5000, models: ['GPT-3.5', 'GPT-4'], features: ['premium_support', 'advanced_analytics', 'dedicated_account_manager'] },
};

// Define the UserPlanDetails type
type UserPlanDetails = {
  plan: string;
  credits: number;
  tokens: number;
  models: string[];
  features: string[];
};

export async function getUserPlanDetails(userId: string): Promise<UserPlanDetails> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true, credits: true },
  });

  if (!user) throw new Error('User not found');
  
  const planDetails = PLAN_DETAILS[user.plan];

  return {
    plan: user.plan,
    credits: user.credits,
    tokens: planDetails.tokens,
    models: planDetails.models,
    features: planDetails.features,
  };
}

export function canUseFeature(plan: string, feature: string): boolean {
  return PLAN_DETAILS[plan].features.includes(feature);
}

export async function checkAndUpdateTokens(userId: string, tokensRequired: number): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user) throw new Error('User not found');
  if (user.credits < tokensRequired) throw new Error('Not enough credits');

  await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: tokensRequired } },
  });

  await db.tokenUsage.create({
    data: {
      userId,
      tokens: tokensRequired,
      reason: 'Question asked in chat session',
    },
  });
}
