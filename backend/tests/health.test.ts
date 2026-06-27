import { expect, test } from 'vitest';
import { createApp } from '../src/app.js';

test('GET /api/v1/health returns success: true and status: ok', async () => {
  const app = await createApp();
  const response = await app.inject({
    method: 'GET',
    url: '/api/v1/health',
  });

  expect(response.statusCode).toBe(200);
  const body = JSON.parse(response.body);
  expect(body).toEqual({
    success: true,
    data: { status: 'ok' },
    message: '',
  });
});
