import { createApp } from '@/app.js';
import { env } from '@/config/env.js';

const start = async () => {
  try {
    const app = await createApp();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
