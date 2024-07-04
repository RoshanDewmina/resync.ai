import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser } from '@/lib/accountUtils'
import { PlanType, User } from '@prisma/client'
import { db } from '@/lib/db'

// Main function to handle POST requests
export async function POST(req: Request) {
  // Get the Clerk webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  // Check if the webhook secret is available
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET in environment variables');
    throw new Error(
      'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers from the incoming request
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If any of the necessary headers are missing, return an error response
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Error occurred -- no svix headers', {
      status: 400
    })
  }

  // Get the request body as JSON
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload using the Svix instance and headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
    console.log('Webhook verified:', evt);
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  // Extract the event type from the verified event
  const eventType = evt.type
  console.log('Event type:', eventType);

  // Handle the user.created event type
  if (eventType === 'user.created') {
    // Extract user information from the event data
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    console.log('User data from event:', { id, email_addresses, first_name, last_name, image_url });

    // Check if required data is present
    if (!id || !email_addresses) {
      console.error('Missing required user data in event');
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const email = email_addresses[0].email_address;

        // Check if the user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('User already exists:', existingUser);
            return new Response('User already exists', { status: 200 });
        }

    // Prepare the user object for database insertion
    const user = {
      clerkUserId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
      // plan:'Trial',
      // credits: 300
    }

    console.log('Creating user:', user);

    // Create the user in the database
    const result = await createUser(user as User)
    console.log('Create user result:', result);

    if (result.error) {
      console.error('Error creating user in database:', result.error);
      return new Response('Error occurred while creating user in database', {
        status: 500
      })
    }
  }

  // Return a success response
  return new Response('', { status: 200 })
}
