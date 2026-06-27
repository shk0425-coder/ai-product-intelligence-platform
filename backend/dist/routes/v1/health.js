"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = healthRoutes;
const index_js_1 = require("@/common/responses/index.js");
async function healthRoutes(fastify, options) {
    fastify.get('/health', async (request, reply) => {
        return (0, index_js_1.successResponse)({ status: 'ok' });
    });
}
