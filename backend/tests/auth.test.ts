import { expect, test, describe } from 'vitest';
import { createApp } from '../src/app.js';
import { tokenProvider } from '../src/utils/jwt.js';
import { UserRole } from '../src/modules/auth/types.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

describe('Authentication API & Utilities', () => {

  test('JWT Utility - verify success with valid token', () => {
    const payload = { userId: '123', email: 'test@example.com', role: UserRole.USER };
    const token = tokenProvider.generateAccessToken(payload);
    const decoded = tokenProvider.verifyAccessToken(token);
    expect(decoded.userId).toBe('123');
    expect(decoded.email).toBe('test@example.com');
  });

  test('JWT Utility - verify failure with invalid token signature', () => {
    expect(() => {
      tokenProvider.verifyAccessToken('invalid-token-string');
    }).toThrow();
  });

  test('JWT Utility - verify failure with expired token', () => {
    const expiredPayload = {
      userId: '123',
      email: 'test@example.com',
      role: UserRole.USER,
      exp: Math.floor(Date.now() / 1000) - 60,
    };
    const token = jwt.sign(expiredPayload, env.JWT_SECRET);
    expect(() => {
      tokenProvider.verifyAccessToken(token);
    }).toThrow();
  });

  test('POST /api/v1/auth/login - success with valid credentials', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'password',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
  });

  test('POST /api/v1/auth/login - failure with invalid credentials', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  test('POST /api/v1/auth/refresh - success with valid refresh token', async () => {
    const app = await createApp();
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'password',
      },
    });
    const { refreshToken } = JSON.parse(loginResponse.body).data;

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
  });

  test('POST /api/v1/auth/refresh - failure with invalid refresh token', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken: 'invalid-refresh-token' },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_INVALID_TOKEN');
  });

  test('POST /api/v1/auth/refresh - failure when calling with access token', async () => {
    const app = await createApp();
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'password',
      },
    });
    const { accessToken } = JSON.parse(loginResponse.body).data;

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken: accessToken },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_INVALID_TOKEN');
  });

  test('GET /api/v1/protected - success with valid access token', async () => {
    const app = await createApp();
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'password',
      },
    });
    const { accessToken } = JSON.parse(loginResponse.body).data;

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/protected',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('admin@test.com');
  });

  test('GET /api/v1/protected - failure without authorization header', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/protected',
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_UNAUTHORIZED');
  });

  test('GET /api/v1/protected - failure with expired access token', async () => {
    const app = await createApp();
    const expiredPayload = {
      userId: 'mock-admin-uuid-1234',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      exp: Math.floor(Date.now() / 1000) - 60,
    };
    const token = jwt.sign(expiredPayload, env.JWT_SECRET);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/protected',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('AUTH_EXPIRED_TOKEN');
  });

  test('POST /api/v1/auth/logout - success', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Logout successful');
  });

});
