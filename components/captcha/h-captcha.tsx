import React, { useRef, useCallback, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface HCaptchaProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  onExpire?: () => void;
  size?: 'invisible' | 'normal' | 'compact';
  theme?: 'light' | 'dark';
  sitekey?: string;
}

/**
 * HCaptcha component for bot protection
 * 
 * @param onVerify - Callback function that receives the verification token
 * @param onError - Optional callback for error handling
 * @param onExpire - Optional callback for when the captcha expires
 * @param size - Size of the captcha widget (default: 'invisible')
 * @param theme - Theme of the captcha widget (default: 'light')
 * @param sitekey - Optional custom sitekey (defaults to env variable or fallback)
 */
export const Captcha: React.FC<HCaptchaProps> = ({
  onVerify,
  onError,
  onExpire,
  size = 'invisible',
  theme = 'light',
  sitekey,
}) => {
  const captchaRef = useRef<HCaptcha>(null);
  const [loading, setLoading] = useState(false);

  // Default site key from environment or use the provided fallback
  const defaultSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '830ce90a-6f78-4630-8094-501a3932f5c4';
  const activeSiteKey = sitekey || defaultSiteKey;

  const handleVerify = useCallback((token: string) => {
    setLoading(false);
    onVerify(token);
  }, [onVerify]);

  // The HCaptcha component expects onError to handle a string, but our interface expects an Error
  // Use type assertion to handle this mismatch
  const handleError = useCallback((event: string | Error) => {
    setLoading(false);
    const error = event instanceof Error ? event : new Error(String(event));
    console.error('hCaptcha error:', error);
    if (onError) onError(error);
  }, [onError]);

  const handleExpire = useCallback(() => {
    setLoading(false);
    console.warn('hCaptcha token expired');
    if (onExpire) onExpire();
  }, [onExpire]);

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
    }
  }, []);

  return (
    <div className="h-captcha-container">
      <HCaptcha
        ref={captchaRef}
        sitekey={activeSiteKey}
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        size={size}
        theme={theme}
      />
      {loading && <span className="sr-only">Verifying that you're human...</span>}
    </div>
  );
};

// Export the ref methods for programmatic usage
export const useCaptcha = () => {
  const captchaRef = useRef<{
    execute: () => void;
    reset: () => void;
  } | null>(null);

  return {
    captchaRef,
    execute: () => captchaRef.current?.execute(),
    reset: () => captchaRef.current?.reset(),
  };
};
