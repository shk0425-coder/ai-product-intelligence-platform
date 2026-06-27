"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseLoggingHook = exports.loggingHook = void 0;
const loggingHook = async (request) => {
    request.log.info({
        msg: 'incoming request',
        method: request.method,
        url: request.url,
        requestId: request.id,
    });
};
exports.loggingHook = loggingHook;
const responseLoggingHook = async (request, reply) => {
    const duration = request.startTime ? Date.now() - request.startTime : undefined;
    request.log.info({
        msg: 'request completed',
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        durationMs: duration,
        requestId: request.id,
    });
};
exports.responseLoggingHook = responseLoggingHook;
