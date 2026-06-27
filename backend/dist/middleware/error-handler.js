"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const index_js_1 = require("@/common/errors/index.js");
const index_js_2 = require("@/common/responses/index.js");
const errorHandler = (error, request, reply) => {
    request.log.error(error);
    // Handle custom application errors
    if (error instanceof index_js_1.AppError) {
        return reply.status(error.statusCode).send((0, index_js_2.errorResponse)(error.code, error.message));
    }
    // Handle Fastify schema validation errors
    if (error.validation) {
        const message = error.validation
            .map((err) => `${err.instancePath || ''} ${err.message}`.trim())
            .join(', ');
        return reply.status(400).send((0, index_js_2.errorResponse)('VALIDATION_ERROR', message));
    }
    // Fallback for generic/internal server errors
    const statusCode = error.statusCode || 500;
    const errorCode = statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : error.code || 'UNKNOWN_ERROR';
    const message = statusCode === 500 ? 'An unexpected error occurred' : error.message;
    return reply.status(statusCode).send((0, index_js_2.errorResponse)(errorCode, message));
};
exports.errorHandler = errorHandler;
