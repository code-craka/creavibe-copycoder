/**
 * Utility for verifying hCaptcha tokens on the server
 */

/**
 * Response from the hCaptcha verification API
 */
interface HCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  credit?: boolean;
  'error-codes'?: string[];
}

/**
 * Options for verifying a captcha token
 */
interface VerifyCaptchaOptions {
  token: string;
  secretKey?: string;
  remoteip?: string;
  sitekey?: string;
}

/**
 * Verify an hCaptcha token with the hCaptcha API
 * 
 * @param options The verification options
 * @returns Promise resolving to verification result
 */
export async function verifyCaptcha({
  token,
  secretKey,
  remoteip,
  sitekey,
}: VerifyCaptchaOptions): Promise<{ success: boolean; errorCodes?: string[] }> {
  if (!token) {
    return { success: false, errorCodes: ['missing-token'] };
  }

  // Use provided secret key or fall back to environment variable
  const key = secretKey || process.env.HCAPTCHA_SECRET_KEY;
  if (!key) {
    console.error('Missing hCaptcha secret key');
    return { success: false, errorCodes: ['missing-secret-key'] };
  }

  // Use provided site key or fall back to environment variable
  const site = sitekey || process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '830ce90a-6f78-4630-8094-501a3932f5c4';

  try {
    const formData = new URLSearchParams();
    formData.append('secret', key);
    formData.append('response', token);
    
    // Optional parameters
    if (remoteip) formData.append('remoteip', remoteip);
    if (site) formData.append('sitekey', site);

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: HCaptchaVerifyResponse = await response.json();
    
    return {
      success: data.success,
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return {
      success: false,
      errorCodes: ['verification-failed'],
    };
  }
}

/**
 * Middleware function to verify hCaptcha tokens in API routes
 * 
 * @param handler The API route handler function
 * @returns A new handler function that verifies the captcha token
 */
export function withCaptchaVerification(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const body = await req.json();
      const { captchaToken } = body;

      if (!captchaToken) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Captcha verification failed: Missing token' 
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const verification = await verifyCaptcha({ token: captchaToken });

      if (!verification.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Captcha verification failed', 
            errorCodes: verification.errorCodes 
          }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Modify the request to include the verification result
      const newReq = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify({ ...body, captchaVerified: true }),
      });

      return handler(newReq, ...args);
    } catch (error) {
      console.error('Error in captcha verification middleware:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Internal server error during captcha verification' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}
