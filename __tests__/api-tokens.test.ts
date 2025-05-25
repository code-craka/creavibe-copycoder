/**
 * Tests for API Tokens functionality
 */

import { createApiToken, getApiTokens, revokeApiToken } from '../app/actions/api-tokens';

// Mock the Supabase client
jest.mock('../utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null
      })
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 'test-token-id', name: 'Test Token', created_at: new Date().toISOString() },
            error: null
          }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 'token1', name: 'Token 1', created_at: new Date().toISOString() },
              error: null
            }))
          })),
          order: jest.fn(() => ({
            data: [
              { id: 'token1', name: 'Token 1', created_at: new Date().toISOString() },
              { id: 'token2', name: 'Token 2', created_at: new Date().toISOString() }
            ],
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { success: true },
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

// Mock Next.js cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn()
}));

describe('API Tokens', () => {
  test('createApiToken creates a new token', async () => {
    const result = await createApiToken('Test Token');
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.token?.name).toBe('Test Token');
  });

  test('getApiTokens returns a list of tokens', async () => {
    const result = await getApiTokens();
    expect(result.success).toBe(true);
    expect(result.tokens).toHaveLength(2);
    expect(result.tokens?.[0].id).toBe('token1');
    expect(result.tokens?.[1].id).toBe('token2');
  });

  test('revokeApiToken revokes a token', async () => {
    const result = await revokeApiToken('token1');
    expect(result.success).toBe(true);
  });
});
