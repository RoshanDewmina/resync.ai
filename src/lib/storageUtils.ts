// lib/storageUtils
import { db } from "@/lib/db";
import { PlanType } from "@prisma/client";
import { privileges } from "@/lib/privileges"; // Assuming you have a file defining plan privileges

export async function checkStorageUsage(clerkUserId: string, fileSizeKB: number) {
  const user = await db.user.findUnique({
    where: { clerkUserId },
    include: { subscriptions: true, Storage: true },
  });

  if (!user || !user.subscriptions || !user.subscriptions[0] || !user.Storage.length) {
    throw new Error("User, subscription, or storage not found");
  }

  const subscription = user.subscriptions[0];
  const planPrivileges = privileges[subscription.planType];

  const totalStorageUsedKB = user.Storage[0].storageUsed;
  const maxStorageKB = planPrivileges.maxStorageGB ? planPrivileges.maxStorageGB * 1024 * 1024 : Infinity;

  if (totalStorageUsedKB + fileSizeKB > maxStorageKB) {
    throw new Error("Insufficient storage space");
  }

  return totalStorageUsedKB + fileSizeKB;
}

export async function updateStorageUsage(clerkUserId: string, fileSizeKB: number) {
  const totalStorageUsedKB = await checkStorageUsage(clerkUserId, fileSizeKB);

  await db.storage.update({
    where: { userId: clerkUserId },
    data: { storageUsed: totalStorageUsedKB },
  });
}
