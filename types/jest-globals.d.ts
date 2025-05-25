// Type definitions for Jest globals
declare global {
  // Jest testing globals
  const describe: (name: string, fn: () => void) => void;
  const test: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
  const it: typeof test;
  const expect: jest.Expect;
  const beforeAll: (fn: () => void | Promise<void>, timeout?: number) => void;
  const beforeEach: (fn: () => void | Promise<void>, timeout?: number) => void;
  const afterAll: (fn: () => void | Promise<void>, timeout?: number) => void;
  const afterEach: (fn: () => void | Promise<void>, timeout?: number) => void;
  const jest: typeof import('jest');
}

// This needs to be an actual module
export {};
