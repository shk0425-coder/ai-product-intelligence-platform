"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const request_id_js_1 = require("@/middleware/request-id.js");
const request_time_js_1 = require("@/middleware/request-time.js");
const logging_js_1 = require("@/middleware/logging.js");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.addHook('onRequest', request_time_js_1.requestTimeHook);
    fastify.addHook('onRequest', request_id_js_1.requestIdHook);
    fastify.addHook('onRequest', logging_js_1.loggingHook);
    fastify.addHook('onResponse', logging_js_1.responseLoggingHook);
});
