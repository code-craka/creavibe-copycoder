import { NextRequest, NextResponse } from 'next/server';
import { withCaptchaVerification } from '@/utils/captcha/verify-captcha';
import { rateLimit } from '@/utils/rate-limit';

// Define the request handler
async function handler(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(req, {
    limit: 5,
    windowInSeconds: 60 * 10, // 10 minutes
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': (rateLimitResult.reset - Math.floor(Date.now() / 1000)).toString(),
        },
      }
    );
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { email, message, captchaVerified } = body;

    // Validate inputs
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Ensure captcha was verified by the middleware
    if (!captchaVerified) {
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    // Process the contact form submission
    // This is where you would send an email, store in database, etc.
    console.log('Processing contact form submission:', { email, message });

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// Wrap the handler with captcha verification middleware
export const POST = withCaptchaVerification(handler);
