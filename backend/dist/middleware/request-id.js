"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdHook = void 0;
const requestIdHook = async (request, reply) => {
    reply.header('x-request-id', request.id);
};
exports.requestIdHook = requestIdHook;
