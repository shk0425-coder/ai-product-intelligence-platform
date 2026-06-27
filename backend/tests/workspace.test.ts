import { vi, describe, it, expect, beforeAll } from 'vitest';

// Use vi.hoisted to declare variables that need to be accessible within vi.mock
const { mockQueryBuilder, setResolver } = vi.hoisted(() => {
  const qb: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  };

  const methods = ['select', 'insert', 'update', 'eq', 'is', 'order', 'range', 'maybeSingle', 'single'];
  for (const m of methods) {
    qb[m].mockImplementation(() => qb);
  }

  let resolver = () => Promise.resolve({ data: null, count: 0, error: null });
  qb.then = (onfulfilled: any) => resolver().then(onfulfilled);

  return {
    mockQueryBuilder: qb,
    setResolver: (newResolver: any) => {
      resolver = newResolver;
    },
  };
});

vi.mock('@/config/supabase.js', () => {
  return {
    supabase: {
      from: vi.fn().mockReturnValue(mockQueryBuilder),
    },
  };
});

import { createApp } from '@/app.js';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';

// Helper to generate JWT token for testing
const generateTestToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email, role: 'USER' }, env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Workspace Module Integration Tests', () => {
  let app: any;
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  const otherUserId = '22222222-2222-2222-2222-222222222222';
  const testToken = generateTestToken(mockUserId, 'test@example.com');
  const otherToken = generateTestToken(otherUserId, 'other@example.com');

  beforeAll(async () => {
    app = await createApp();
  });

  describe('Authentication Check', () => {
    it('should return 401 when calling GET /api/v1/workspaces without authorization', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/workspaces',
      });
      expect(response.statusCode).toBe(401);
    });

    it('should return 401 when calling POST /api/v1/workspaces without authorization', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/workspaces',
        payload: { name: 'Test Workspace' },
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/v1/workspaces', () => {
    it('should successfully create a workspace and return 201 with DTO', async () => {
      const workspaceId = '33333333-3333-3333-3333-333333333333';
      
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // Name check: findByName
          return Promise.resolve({ data: null, error: null });
        }
        // Insert: create
        return Promise.resolve({
          data: {
            workspace_id: workspaceId,
            org_id: mockUserId,
            name: 'New Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/workspaces',
        headers: { authorization: `Bearer ${testToken}` },
        payload: { name: 'New Workspace' },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.workspaceId).toBe(workspaceId);
      expect(body.data.name).toBe('New Workspace');
      expect(body.data.orgId).toBe(mockUserId);
    });

    it('should return 409 when attempting to create a duplicate workspace name', async () => {
      setResolver(() => {
        return Promise.resolve({
          data: {
            workspace_id: 'existing-id',
            org_id: mockUserId,
            name: 'Existing Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/workspaces',
        headers: { authorization: `Bearer ${testToken}` },
        payload: { name: 'Existing Workspace' },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(409);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('WORKSPACE_ALREADY_EXISTS');
    });

    it('should return 400 when workspace name validation fails (less than 2 characters)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/workspaces',
        headers: { authorization: `Bearer ${testToken}` },
        payload: { name: 'a' },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/workspaces', () => {
    it('should return paginated workspaces matching the owner', async () => {
      const mockWorkspaceList = [
        {
          workspace_id: 'ws-1',
          org_id: mockUserId,
          name: 'Workspace 1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setResolver(() => {
        return Promise.resolve({
          data: mockWorkspaceList,
          count: mockWorkspaceList.length,
          error: null,
        });
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/workspaces?page=1&limit=10&sort=name&order=asc',
        headers: { authorization: `Bearer ${testToken}` },
      });

      const body = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.data.length).toBe(1);
      expect(body.data.data[0].workspaceId).toBe('ws-1');
      expect(body.data.total).toBe(1);
      expect(body.data.page).toBe(1);
      expect(body.data.limit).toBe(10);
    });
  });

  describe('GET /api/v1/workspaces/:id', () => {
    const validUuid = '55555555-5555-5555-5555-555555555555';

    it('should return 400 when param ID is not a valid UUID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/workspaces/invalid-uuid-format',
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(400);
    });

    it('should return 404 when workspace is not found', async () => {
      setResolver(() => Promise.resolve({ data: null, error: null }));

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(404);
    });

    it('should return 403 Forbidden when workspace belongs to a different owner', async () => {
      setResolver(() => {
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            org_id: otherUserId, // Owned by otherUserId
            name: 'Other Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` }, // Requesting as mockUserId
      });
      expect(response.statusCode).toBe(403);
    });

    it('should return 200 with DTO when valid owner retrieves workspace', async () => {
      setResolver(() => {
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            org_id: mockUserId, // Owned by mockUserId
            name: 'My Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.data.workspaceId).toBe(validUuid);
      expect(body.data.name).toBe('My Workspace');
    });
  });

  describe('PATCH /api/v1/workspaces/:id', () => {
    const validUuid = '66666666-6666-6666-6666-666666666666';

    it('should successfully update name when owner calls it', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // findById check (for existence & owner check)
          return Promise.resolve({
            data: {
              workspace_id: validUuid,
              org_id: mockUserId,
              name: 'Old Name',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          });
        }
        if (callCount === 2) {
          // Name check: findByName (returns null)
          return Promise.resolve({ data: null, error: null });
        }
        // Update query
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            org_id: mockUserId,
            name: 'Updated Name',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
        payload: { name: 'Updated Name' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.data.name).toBe('Updated Name');
    });

    it('should return 403 when non-owner tries to update name', async () => {
      setResolver(() => {
        // findById returns workspace belonging to otherUserId
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            org_id: otherUserId,
            name: 'Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` }, // testToken is mockUserId
        payload: { name: 'New Name' },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/v1/workspaces/:id', () => {
    const validUuid = '77777777-7777-7777-7777-777777777777';

    it('should successfully soft-delete workspace when owner calls it', async () => {
      let callCount = 0;
      setResolver(() => {
        callCount++;
        if (callCount === 1) {
          // findById check (for existence & owner check)
          return Promise.resolve({
            data: {
              workspace_id: validUuid,
              org_id: mockUserId,
              name: 'My Workspace',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          });
        }
        // Delete query (Soft delete updates deleted_at)
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            deleted_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.success).toBe(true);
    });

    it('should return 403 when non-owner tries to delete workspace', async () => {
      setResolver(() => {
        return Promise.resolve({
          data: {
            workspace_id: validUuid,
            org_id: otherUserId,
            name: 'Workspace',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          error: null,
        });
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/workspaces/${validUuid}`,
        headers: { authorization: `Bearer ${testToken}` },
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
