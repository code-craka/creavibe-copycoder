import { useState, useCallback, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface UseHCaptchaOptions {
  onVerify?: (token: string) => void;
  onError?: (error: string | Error) => void; // Accept both string and Error for flexibility
  onExpire?: () => void;
  siteKey?: string;
}

/**
 * A hook for using hCaptcha in forms and API requests
 * 
 * @param options Configuration options for hCaptcha
 * @returns Object containing captcha state and methods
 */
export function useHCaptcha(options: UseHCaptchaOptions = {}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  // Default site key from environment or use the provided fallback
  const defaultSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '830ce90a-6f78-4630-8094-501a3932f5c4';
  const siteKey = options.siteKey || defaultSiteKey;

  const handleVerify = useCallback((captchaToken: string) => {
    setToken(captchaToken);
    setLoading(false);
    setError(null);
    
    if (options.onVerify) {
      options.onVerify(captchaToken);
    }
  }, [options]);

  const handleError = useCallback((event: string) => {
    const err = new Error(event);
    setError(err);
    setLoading(false);
    console.error('hCaptcha error:', event);
    
    if (options.onError) {
      options.onError(event); // Pass the original string event to maintain type compatibility
    }
  }, [options]);

  const handleExpire = useCallback(() => {
    setToken(null);
    setLoading(false);
    console.warn('hCaptcha token expired');
    
    if (options.onExpire) {
      options.onExpire();
    }
  }, [options]);

  /**
   * Execute the captcha programmatically
   * Useful for invisible captchas
   */
  const execute = useCallback(() => {
    if (captchaRef.current) {
      setLoading(true);
      captchaRef.current.execute();
    }
  }, []);

  /**
   * Reset the captcha
   */
  const reset = useCallback(() => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
      setToken(null);
    }
  }, []);

  /**
   * Add the captcha token to a request payload
   * @param data The original request data
   * @returns The data with the captcha token added
   */
  const withCaptcha = useCallback(<T extends object>(data: T): T & { captchaToken: string } => {
    if (!token) {
      throw new Error('Captcha token not available. Make sure to execute the captcha first.');
    }
    
    return {
      ...data,
      captchaToken: token,
    };
  }, [token]);

  return {
    captchaRef,
    token,
    loading,
    error,
    execute,
    reset,
    withCaptcha,
    handleVerify,
    handleError,
    handleExpire,
    siteKey,
  };
}
