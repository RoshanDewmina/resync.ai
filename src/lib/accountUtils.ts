import { db } from '@/lib/db';
import { User } from '@prisma/client';

export async function checkUserByClerkUserId(clerkUserId: string): Promise<User | null> {
  return await db.user.findUnique({
    where: { clerkUserId },
  });
}

export async function checkUserExists(apiKey: string): Promise<User | null> {
  const integration = await db.integration.findUnique({
    where: { apiKey },
    include: { project: { include: { user: true } } },
  });
  return integration?.project?.user || null;
}

export async function checkStorage(user: User, fileSize: number) {
  let storage = await db.storage.findUnique({
    where: { userId: user.id }
  });

  const storageLimit = user.plan === 'Trial' ? 256 * 1024 * 1024 : user.plan === 'Launch' ? 4 * 1024 * 1024 * 1024 : user.plan === 'Accelerate' ? 12 * 1024 * 1024 * 1024 : user.plan === 'Scale' ? 24 * 1024 * 1024 * 1024 : 0;

  // If storage is null, initialize it
  if (!storage) {
    storage = await db.storage.create({
      data: {
        userId: user.id,
        storageUsed: 0,
      }
    });
  }

  if (storage.storageUsed + fileSize > storageLimit) {
    throw new Error('Storage limit exceeded. Please upgrade your plan.');
  }

  await db.storage.update({
    where: { userId: user.id },
    data: { storageUsed: storage.storageUsed + fileSize }
  });
}

export async function checktokens(user: User, tokensRequired: number) {
  if (user.tokens !== null && user.tokens < tokensRequired) {
    throw new Error('Not enough tokens. Please upgrade your plan.');
  }

  await db.user.update({
    where: { id: user.id },
    data: { tokens: user.tokens !== null ? user.tokens - tokensRequired : 0 }
  });
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    console.log('Creating user with data:', data);
    const user = await db.user.create({
      data: {
        clerkUserId: data.clerkUserId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        // plan: data.plan || 'Trial', // Default to 'Starter' if not provided
        tokens: data.tokens || 300,
        

      }
    });
    console.log('User created:', user);
    return { user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error };
  }
}

export async function getUserById({
  id,
  clerkUserId
}: {
  id?: string;
  clerkUserId?: string;
}) {
  try {
    if (!id && !clerkUserId) {
      throw new Error('id or clerkUserId is required');
    }

    const query = id ? { id } : { clerkUserId };
    console.log('Getting user by query:', query);

    const user = await db.user.findUnique({ where: query });
    console.log('User found:', user);
    return { user };
  } catch (error) {
    console.error('Error getting user by id:', error);
    return { error };
  }
}

export async function updateUser(id: string, data: Partial<User>) {
  try {
    console.log('Updating user with id:', id, 'and data:', data);
    const user = await db.user.update({
      where: { id },
      data
    });
    console.log('User updated:', user);
    return { user };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error };
  }
}
