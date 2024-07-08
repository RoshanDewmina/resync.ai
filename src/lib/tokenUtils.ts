// src/lib/tokenUtils.ts
import { db } from "@/lib/db";

export async function getTokenBalance(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { tokens: true },
  });

  return user?.tokens ?? 0;
}



export async function deductTokens(userId: string, tokensToDeduct: number): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { tokens: true },
  });

  if (!user || (user.tokens ?? 0) < tokensToDeduct) {
    return false;
  }

  await db.user.update({
    where: { id: userId },
    data: { tokens: { decrement: tokensToDeduct } },
  });

  await db.tokenUsage.create({
    data: {
      userId,
      tokens: tokensToDeduct,
      reason: 'Question asked',
    },
  });

  return true;
}

export async function canUserAskQuestion(userId: string, tokensRequired: number): Promise<boolean> {
  const tokenBalance = await getTokenBalance(userId);
  return tokenBalance >= tokensRequired;
}

export async function addTokens(userId: string, tokensToAdd: number): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { tokens: { increment: tokensToAdd } },
  });
}

export async function resetTokens(userId: string, newTokenAmount: number): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { tokens: newTokenAmount },
  });
}
