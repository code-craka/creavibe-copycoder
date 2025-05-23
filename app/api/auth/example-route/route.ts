import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/utils/rate-limit';
import { createAdminClient } from '@/utils/supabase/clients';

// Example authentication route with rate limiting
// This demonstrates how to protect sensitive endpoints from brute force attacks

async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use admin client for auth operations
    const supabase = createAdminClient();
    
    // Example operation: Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      // Don't reveal specific errors to prevent enumeration attacks
      return NextResponse.json(
        { message: 'If your email exists in our system, you will receive a password reset link' }, 
        { status: 200 }
      );
    }

    // Return a generic success message regardless of whether the email exists
    // This prevents user enumeration attacks
    return NextResponse.json(
      { message: 'If your email exists in our system, you will receive a password reset link' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handler
// Limit to 5 requests per minute per IP address
export const POST = withRateLimit(handler, {
  limit: 5,
  windowInSeconds: 60,
});
