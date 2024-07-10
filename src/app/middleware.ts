
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';


const ratelimit = new Ratelimit({
  redis: kv,
  // 5 requests from the same IP in 10 seconds
  limiter: Ratelimit.slidingWindow(100, '10 s'),
});


export async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? '127.0.0.1';
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/', request.url));
}


export const config = {
  matcher: ["/api(.*)"],
};


// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';
// import { kv } from '@vercel/kv';

// // Define the rate limiter with Upstash and Vercel KV
// const ratelimit = new Ratelimit({
//   redis: kv,
//   limiter: Ratelimit.slidingWindow(50, '1 m'), // 5 requests per 10 seconds
// });

// // Custom Clerk middleware with rate limiting
// export default clerkMiddleware(async (auth, request) => {
//   // Rate limiting logic
//   const ip = request.ip ?? '127.0.0.1';
//   const { success } = await ratelimit.limit(ip);

//   if (!success) {
//     return NextResponse.redirect(new URL('/blocked', request.url));
//   }

//   // Return the next response if rate limiting is not exceeded
//   return NextResponse.next();
// });

// // Configuration to apply middleware to specific routes
// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
