// This file sets up the Jest environment globals
/* global process */
process.env.NODE_ENV = 'test';

// Set up test environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock console methods if needed
// global.console = {
//   ...console,
//   log: jest.fn(),
//   info: jest.fn(),
//   debug: jest.fn(),
//   warn: console.warn,
//   error: console.error,
// };
