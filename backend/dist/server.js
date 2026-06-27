"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("@/app.js");
const env_js_1 = require("@/config/env.js");
const start = async () => {
    try {
        const app = await (0, app_js_1.createApp)();
        await app.listen({ port: env_js_1.env.PORT, host: '0.0.0.0' });
        app.log.info(`🚀 Server running on http://localhost:${env_js_1.env.PORT}`);
    }
    catch (err) {
        console.error('❌ Error starting server:', err);
        process.exit(1);
    }
};
start();
