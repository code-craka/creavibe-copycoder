import React, { useState } from 'react';
import { useHCaptcha } from '@/hooks/use-hcaptcha';
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * Example form component demonstrating how to use hCaptcha
 */
export function ExampleForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Initialize hCaptcha hook
  const {
    captchaRef,
    token,
    loading: captchaLoading,
    error: captchaError,
    execute,
    reset,
    handleVerify,
    handleError,
    handleExpire,
    siteKey
  } = useHCaptcha({
    // Optional callback when verification is successful
    onVerify: (token) => {
      console.log('Captcha verified, submitting form...');
      handleFormSubmit(token);
    },
    // We don't need to specify a custom onError handler here
    // as the default one from useHCaptcha will handle it
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !message) {
      setSubmitResult({
        success: false,
        message: 'Please fill in all fields'
      });
      return;
    }
    
    // Execute captcha verification
    // This will trigger the onVerify callback when successful
    execute();
  };
  
  // Handle the actual form submission after captcha verification
  const handleFormSubmit = async (captchaToken: string) => {
    try {
      setIsSubmitting(true);
      
      // Example API call with captcha token
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
          captchaToken, // Include the token in your API request
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitResult({
          success: true,
          message: 'Message sent successfully!'
        });
        
        // Reset form
        setEmail('');
        setMessage('');
        reset(); // Reset captcha
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Failed to send message'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Contact Form with hCaptcha</h2>
      
      {submitResult && (
        <div 
          className={`p-3 mb-4 rounded ${
            submitResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {submitResult.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>
        
        {/* Hidden hCaptcha component */}
        <div className="hidden">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={handleVerify}
            onError={handleError}
            onExpire={handleExpire}
            size="invisible"
          />
        </div>
        
        {captchaError && (
          <div className="p-3 mb-4 bg-red-100 text-red-800 rounded">
            Captcha error: Please refresh and try again
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || captchaLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting || captchaLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting || captchaLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
